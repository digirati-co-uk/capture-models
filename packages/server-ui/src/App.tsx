import { Revisions } from '@capture-models/editor';
import React, { useEffect, useState } from 'react';
import { Link, NavLink, Route, Switch, useRouteMatch } from 'react-router-dom';
import { CaptureModelListing } from './containers/CaptureModelListing';
import { Fixtures } from './containers/Fixtures';
import { Homepage } from './containers/Homepage';
import { Viewer } from './containers/Viewer';
import { RevisionsManager } from './containers/RevisionsManager';
import { CaptureModelEditor } from './containers/CaptureModelEditor';
import { useApiModel } from './utility/useModels';
import { useCurrentUser } from './utility/user-context';
import { Menu } from 'semantic-ui-react';

export const App: React.FC = () => {
  const [selectedContent, setSelectedContent] = useState<{ label: string; manifest: string; thumbnail?: string }>();
  const [selectedCaptureModelId, setSelectedCaptureModelId] = useState<string>();
  const [captureModel, refresh] = useApiModel(selectedCaptureModelId);
  const { user } = useCurrentUser();

  return (
    <Revisions.Provider captureModel={captureModel}>
      <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '100vh', height: '100vh' }}>
        <Menu inverted compact={true} attached={true}>
          <Menu.Item>
            <NavLink to="/">Crowdsourcing editor</NavLink>
          </Menu.Item>

          <Menu.Item as={NavLink} to="/fixtures">
            Fixtures
          </Menu.Item>

          <Menu.Item as={NavLink} to="/viewer">
            Viewer
          </Menu.Item>

          <Menu.Item as={NavLink} to="/editor">
            Editor
          </Menu.Item>

          <Menu.Item position="right">
            <strong>{user.name}</strong>
          </Menu.Item>
        </Menu>
        <Switch>
          <Route path="/" exact>
            <Homepage />
          </Route>

          <Route path="/fixtures">
            <Fixtures />
          </Route>

          <Route path="/revisions">
            <RevisionsManager />
          </Route>

          <Route
            path={['/viewer/:id', '/viewer']}
            render={() => (
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
            )}
          />

          <Route path="/editor" exact>
            <CaptureModelListing />
          </Route>

          <Route path="/editor/:id">
            <CaptureModelEditor
              onUpdate={id => {
                if (id === selectedCaptureModelId) {
                  console.log('refresh?')
                  refresh();
                }
              }}
            />
          </Route>
        </Switch>
      </div>
    </Revisions.Provider>
  );
};
