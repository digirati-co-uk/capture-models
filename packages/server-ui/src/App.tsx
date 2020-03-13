import { Revisions } from '@capture-models/editor';
import React, { useState } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { CaptureModelListing } from './containers/CaptureModelListing';
import { Homepage } from './containers/Homepage';
import { Viewer } from './containers/Viewer';
import { RevisionsManager } from './containers/RevisionsManager';
import { CaptureModelEditor } from './containers/CaptureModelEditor';
import { useApiModel } from './utility/useModels';
import { useCurrentUser } from './utility/user-context';

export const App: React.FC = () => {
  const [selectedContent, setSelectedContent] = useState<{ label: string; manifest: string; thumbnail?: string }>();
  const [selectedCaptureModelId, setSelectedCaptureModelId] = useState<string>();
  const captureModel = useApiModel(selectedCaptureModelId);
  const { user } = useCurrentUser();

  return (
    <Revisions.Provider captureModel={captureModel}>
      <h1>Home</h1>
      <p>Logged in as {user.name}.</p>
      <nav>
        <Link to="/">Home</Link> | <a href="/fixtures">Fixtures</a> | <Link to="/revisions">Revisions</Link> |{' '}
        <Link to="/viewer">Viewer</Link> | <Link to="/editor">Editor</Link>
      </nav>
      <Switch>
        <Route path="/" exact>
          <Homepage />
        </Route>

        <Route path="/revisions">
          <RevisionsManager />
        </Route>

        <Route path="/viewer" exact>
          <Viewer
            backHome={() => {
              setSelectedContent(undefined);
              setSelectedCaptureModelId(undefined);
            }}
            selectedCaptureModel={captureModel}
            setSelectedCaptureModel={setSelectedCaptureModelId}
            selectedContent={selectedContent}
            setSelectedContent={setSelectedContent}
          />
        </Route>

        <Route path="/editor" exact>
          <CaptureModelListing />
        </Route>

        <Route path="/editor/:id">
          <CaptureModelEditor />
        </Route>
      </Switch>
    </Revisions.Provider>
  );
};
