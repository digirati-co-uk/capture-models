import { EditorContext } from '@capture-models/editor';
import { CaptureModel } from '@capture-models/types';
import React, { useEffect, useRef } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';
import { useCaptureModelApi } from '../hooks/use-caputre-model-api';
import { FullDocumentEditor } from './FullDocumentEditor';
import { FullStructureEditor } from './FullStructureEditor';
import { MenuItem } from '../components/MenuItem/MenuItem';

export const CaptureModelEditor: React.FC = () => {
  const match = useRouteMatch<{ id: string }>();
  const id = match.params.id;
  const [model, { error, fetching, update }] = useCaptureModelApi(id);

  const [onDocumentChange] = useDebouncedCallback((doc: CaptureModel['document']) => {
    if (model) {
      update({
        ...model,
        document: doc,
      });
    }
  }, 1000);

  const [onStructureChange] = useDebouncedCallback((structure: CaptureModel['structure']) => {
    if (model) {
      update({
        ...model,
        structure,
      });
    }
  }, 1000);

  const functions = useRef<any>({
    onStructureChange,
    onDocumentChange,
  });

  useEffect(() => {
    functions.current = {
      onStructureChange,
      onDocumentChange,
    };
  }, [onStructureChange, onDocumentChange]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!model || fetching) {
    return <>loading...</>;
  }

  return (
    <EditorContext
      captureModel={model}
      onDocumentChange={doc => functions.current.onDocumentChange(doc)}
      onStructureChange={struct => functions.current.onStructureChange(struct)}
    >
      <Switch>
        <Route path="/editor/:id/document" exact>
          <FullDocumentEditor />
        </Route>
        <Route path="/editor/:id/structure" exact>
          <FullStructureEditor />
        </Route>
        <Route path="/editor/:id" exact>
          <h1>
            <MenuItem href={`/editor/${id}/document`}>Document</MenuItem>
            <MenuItem href={`/editor/${id}/structure`}>Structure</MenuItem>
          </h1>
        </Route>
      </Switch>
    </EditorContext>
  );
};
