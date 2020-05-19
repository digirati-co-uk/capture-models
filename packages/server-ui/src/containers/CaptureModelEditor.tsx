import { CardButton, EditorContext, RoundedCard } from '@capture-models/editor';
import { CaptureModel } from '@capture-models/types';
import React, { useEffect, useRef } from 'react';
import { Link, NavLink, Route, Switch, useRouteMatch } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';
import { useCaptureModelApi } from '../hooks/use-caputre-model-api';
import { FullDocumentEditor } from './FullDocumentEditor';
import { FullStructureEditor } from './FullStructureEditor';
import { DeleteModel } from '../components/DeleteModel/DeleteModel';

export const CaptureModelEditor: React.FC<{ onUpdate: (id: string) => void }> = ({ onUpdate }) => {
  const match = useRouteMatch<{ id: string }>();
  const id = match.params.id;
  const [model, { error, fetching, update }] = useCaptureModelApi(id);

  const [onDocumentChange] = useDebouncedCallback((doc: CaptureModel['document']) => {
    if (model) {
      update({
        ...model,
        document: doc,
      }).then(() => onUpdate(id));
    }
  }, 1000);

  const [onStructureChange] = useDebouncedCallback((structure: CaptureModel['structure']) => {
    if (model) {
      update({
        ...model,
        structure,
      }).then(() => onUpdate(id));
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
      <div>
        <div>
          <strong>{model?.structure.label}</strong>
        </div>
        <NavLink to={`/editor/${id}/structure`}>Structure</NavLink>
        <NavLink to={`/editor/${id}/document`}>Document</NavLink>
        <NavLink to={`/viewer/${id}`}>Open in viewer</NavLink>
        <NavLink to={`/editor/${id}/json`}>JSON</NavLink>
        <NavLink to={`/editor/${id}/delete`}>Delete model</NavLink>
      </div>
      <Switch>
        <Route path="/editor/:id/document" exact>
          <FullDocumentEditor />
        </Route>
        <Route path="/editor/:id/structure" exact>
          <FullStructureEditor />
        </Route>
        <Route path="/editor/:id/json" exact>
          <div style={{ padding: 40 }}>
            <code>
              <pre>{JSON.stringify(model, null, 4)}</pre>
            </code>
          </div>
        </Route>
        <Route path="/editor/:id/delete" exact>
          <div style={{ padding: 40 }}>
            <DeleteModel id={id} />
          </div>
        </Route>
        <Route path="/editor/:id" exact>
          <div style={{ maxWidth: 550, padding: '20' }}>
            <RoundedCard>
              <h1>Creating a capture model</h1>
              <p style={{ fontSize: '1.3em' }}>
                There are 2 main sections of a model. The first is the document. Each image you crowdsource will have a
                copy of this document. All of the contributions from all users will be building up this single document.
                A document can have either fields for values inputted, such as transcriptions fields, or Entities.
                Entities are a way of nesting related fields. For example, a Person entity may contain all of the fields
                related to people.
              </p>
              <p style={{ fontSize: '1.3em' }}>
                A contributor will be able to add multiple instances of each of these fields and entities. Your document
                may contain a lot of different fields that could be crowdsourced. To manage this and avoid a single
                large form being presented to the user the document is sliced using a Structure. A structure is a subset
                of the fields from the document. This drives a navigation so the user can decide what they want to
                contribute and then only see the fields for that thing.
              </p>
              <p style={{ fontSize: '1.3em' }}>
                You can load some of the fixtures to see examples of various documents and structures.
              </p>
            </RoundedCard>
            <CardButton size="large">
              <Link to={`/editor/${id}/document`} style={{ color: '#fff' }}>
                Get started
              </Link>
            </CardButton>
          </div>
        </Route>
      </Switch>
    </EditorContext>
  );
};
