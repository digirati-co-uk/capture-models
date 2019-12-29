import React, { useEffect, useState } from 'react';
import { useLocation, Switch, Route, Link, RouteComponentProps, useHistory, withRouter } from 'react-router-dom';
import { Card, Grid, Header, Menu, Segment } from 'semantic-ui-react';
import { CaptureModelList } from '../../components/CaptureModelList/CaptureModelList';
import { DocumentEditor } from '../../components/DocumentEditor/DocumentEditor';
import { EditorContext } from '../../components/EditorContext/EditorContext';
import { FieldEditor } from '../../components/FieldEditor/FieldEditor';
import { useCaptureModel } from '../../core/capture-model';
import { useAllDocs, useDatabase } from '../../core/database';
import { DocumentStore } from '../../stores/document/document-store';
import { CaptureModel } from '../../types/capture-model';
import { FieldTypes } from '../../types/field-types';

const Homepage = () => <div>Homepage.</div>;
const About = () => <div>About.</div>;
const Models = () => {
  const db = useDatabase();
  const models = useAllDocs<CaptureModel>();
  const history = useHistory();

  return (
    <Card.Content>
      <CaptureModelList
        captureModels={models}
        onClick={e => history.push(`/editor/${e._id}`)}
        onDelete={e => db.remove({ _id: e._id as string, _rev: e._rev as string })}
      />
      <button
        onClick={() => {
          db.post<CaptureModel>({
            structure: {
              type: 'choice',
              label: 'Untitled model',
              items: [],
            },
            document: {
              type: 'entity',
              properties: {},
            },
          });
        }}
      >
        Add model
      </button>
    </Card.Content>
  );
};

const InnerEditor: React.FC = () => {
  const model = useCaptureModel();
  const state = DocumentStore.useStoreState(s => ({
    subtree: s.subtree,
    subtreePath: s.subtreePath,
    subtreeFields: s.subtreeFields,
    selectedField: s.selectedFieldKey,
  }));
  const actions = DocumentStore.useStoreActions(a => a);

  return (
    <Grid padded>
      <Grid.Column width={6}>
        <DocumentEditor
          selectField={actions.selectField}
          setDescription={actions.setDescription}
          setLabel={actions.setLabel}
          deselectField={actions.deselectField}
          popSubtree={actions.popSubtree}
          pushSubtree={actions.pushSubtree}
          subtree={state.subtree}
          subtreeFields={state.subtreeFields}
          selectedField={state.selectedField}
          subtreePath={state.subtreePath}
          addField={actions.addField}
        />
      </Grid.Column>
      <Grid.Column width={10}>
        {state.selectedField ? (
          <div>
            <FieldEditor
              key={state.selectedField}
              field={state.subtree.properties[state.selectedField][0] as FieldTypes}
              onSubmit={field => {
                actions.setField({ field });
                actions.deselectField();
              }}
            />
          </div>
        ) : (
          <Segment placeholder>
            <Header icon>No field selected</Header>
          </Segment>
        )}
      </Grid.Column>
    </Grid>
  );
};

const ModelEditor: React.FC<RouteComponentProps<{ id: string }>> = ({ match, children }) => {
  const id = match.params.id;
  const db = useDatabase();
  const [model, setModel] = useState<CaptureModel>();

  useEffect(() => {
    db.get<CaptureModel>(id).then(m => {
      setModel(m);
    });
  });

  if (!model) {
    return <>loading...</>;
  }

  return (
    <EditorContext captureModel={model}>
      <InnerEditor />
    </EditorContext>
  );
};
const ModelEditorWithRouter = withRouter(ModelEditor);

const MenuItem: React.FC<{ href: string }> = ({ href, children }) => {
  const location = useLocation();

  return (
    <Link to={href}>
      <Menu.Item name="home" active={location.pathname === href}>
        {children}
      </Menu.Item>
    </Link>
  );
};

export const CaptureModelEditor: React.FC = () => {
  // Routes.
  // - Homepage
  // - About
  // - My models
  // - Import model
  // - Editor
  //    - Edit Document
  //    - Edit Structure
  //    - Preview model
  //    - Save + Export
  return (
    <div>
      <Menu pointing secondary>
        <MenuItem href="/">Home</MenuItem>
        <MenuItem href="/about">About</MenuItem>
        <MenuItem href="/models">My Models</MenuItem>
      </Menu>
      <Switch>
        <Route path="/about">
          <About />
        </Route>

        <Route path="/models">
          <Models />
        </Route>

        <Route path="/editor/:id">
          <ModelEditorWithRouter />
        </Route>

        <Route path="/">
          <Homepage />
        </Route>
      </Switch>
    </div>
  );
};
