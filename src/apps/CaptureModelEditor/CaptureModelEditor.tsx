import React, { useEffect, useRef, useState } from 'react';
import { useLocation, Switch, Route, Link, RouteComponentProps, useHistory, withRouter } from 'react-router-dom';
import { Card, Grid, Header, Menu, Segment, Tab } from 'semantic-ui-react';
import { useDebouncedCallback } from 'use-debounce';
import { CaptureModelList } from '../../components/CaptureModelList/CaptureModelList';
import { DocumentEditor } from '../../components/DocumentEditor/DocumentEditor';
import { EditorContext, useCaptureModel } from '../../components/EditorContext/EditorContext';
import { FieldEditor } from '../../components/FieldEditor/FieldEditor';
import { StructureEditor } from '../../components/StructureEditor/StructureEditor';
import { useAllDocs, useDatabase } from '../../core/database';
import { DocumentStore } from '../../stores/document/document-store';
import { StructureStore } from '../../stores/structure/structure-store';
import { useFocusedStructureEditor } from '../../stores/structure/use-focused-structure-editor';
import { CaptureModel } from '../../types/capture-model';
import { FieldTypes } from '../../types/field-types';
import { createChoice } from '../../utility/create-choice';
import { createDocument } from '../../utility/create-document';

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
            structure: createChoice({ label: 'Untitled model' }),
            document: createDocument(),
          });
        }}
      >
        Add model
      </button>
    </Card.Content>
  );
};

const FullDocumentEditor: React.FC = () => {
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
              term={state.selectedField}
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

const FullStructureEditor: React.FC = () => {
  const document = DocumentStore.useStoreState(state => state.document);
  const tree = StructureStore.useStoreState(state => state.tree);
  const focus = StructureStore.useStoreActions(act => act.focus);
  const current = StructureStore.useStoreState(state => state.focus.structure);
  const currentPath = StructureStore.useStoreState(state => state.focus.index);
  const {
    setLabel,
    setDescription,
    addStructureToChoice,
    setModelFields,
    removeStructureFromChoice,
  } = useFocusedStructureEditor();

  return (
    <StructureEditor
      tree={tree}
      document={document}
      setLabel={setLabel}
      setDescription={setDescription}
      onAddChoice={addStructureToChoice}
      onAddModel={addStructureToChoice}
      pushFocus={focus.pushFocus}
      popFocus={focus.popFocus}
      setFocus={focus.setFocus}
      onRemove={removeStructureFromChoice}
      currentPath={currentPath}
      setModelFields={setModelFields}
      structure={current as CaptureModel['structure']}
    />
  );
};

const Preview: React.FC = () => {
  const captureModel = useCaptureModel();

  return (
    <pre>
      <code>{JSON.stringify(captureModel, null, 2)}</code>
    </pre>
  );
};

const panes: React.ComponentProps<typeof Tab>['panes'] = [
  {
    menuItem: 'Document',
    render: () => <FullDocumentEditor />,
  },
  {
    menuItem: 'Structure',
    render: () => <FullStructureEditor />,
  },
  {
    menuItem: 'Preview',
    render: () => <Preview />,
  },
  {
    menuItem: 'Export',
    render: () => <>Export</>,
  },
];

const ModelEditor: React.FC<RouteComponentProps<{ id: string }>> = ({ match, children }) => {
  const id = match.params.id;
  const db = useDatabase();
  const [model, setModel] = useState<CaptureModel & { _rev: string; _id: string }>();
  const rev = useRef<string>('');

  useEffect(() => {
    db.get<CaptureModel>(id).then(m => {
      rev.current = m._rev;
      setModel(m);
    });
  }, [db, id]);

  const [onDocumentChange] = useDebouncedCallback((doc: CaptureModel['document']) => {
    if (model && rev) {
      db.post<CaptureModel>({
        ...model,
        _rev: rev.current,
        document: doc,
      }).then(resp => {
        rev.current = resp.rev;
        setModel({
          ...model,
          _rev: resp.rev,
          document: doc,
        });
      });
    }
  }, 1000);

  const [onStructureChange] = useDebouncedCallback((structure: CaptureModel['structure']) => {
    if (model && rev) {
      db.post<CaptureModel>({
        ...model,
        _rev: rev.current,
        structure,
      }).then(resp => {
        rev.current = resp.rev;
        setModel({
          ...model,
          _rev: resp.rev,
          structure,
        });
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

  if (!model) {
    return <>loading...</>;
  }

  return (
    <EditorContext
      captureModel={model}
      onDocumentChange={doc => functions.current.onDocumentChange(doc)}
      onStructureChange={struct => functions.current.onStructureChange(struct)}
    >
      <Tab menu={{ secondary: true, vertical: true, pointing: true }} panes={panes} />
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
      <div style={{ background: '#000', marginBottom: 20 }}>
        <Menu inverted pointing secondary>
          <MenuItem href="/">Home</MenuItem>
          <MenuItem href="/about">About</MenuItem>
          <MenuItem href="/models">My Models</MenuItem>
        </Menu>
      </div>
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
