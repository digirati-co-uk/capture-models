import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Route, RouteComponentProps, Switch, useHistory, useLocation, withRouter } from 'react-router-dom';
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
import { createChoice } from '../../utility/create-choice';
import { createDocument } from '../../utility/create-document';
import { useNavigation } from '../../hooks/useNavigation';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from '../../themes';
import { BackgroundSplash } from '../../components/BackgroundSplash/BackgroundSplash';
import { RoundedCard } from '../../components/RoundedCard/RoundedCard';
import { RevisionStore } from '../../stores/revisions/revisions-store';
import { CardDropdown } from '../../components/CardDropdown/CardDropdown';
import { CardButton } from '../../components/CardButton/CardButton';
import { BaseField, CaptureModel, StructureType } from '@capture-models/types';

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

// @todo I think it's clear that Document Editor should also be a connected component.
// @todo I think it's also clear we need a field editor that can handle null states and be connected.
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
          setSelector={actions.setSelector}
        />
      </Grid.Column>
      <Grid.Column width={10}>
        {state.selectedField ? (
          <div>
            <FieldEditor
              key={state.selectedField}
              term={state.selectedField}
              field={state.subtree.properties[state.selectedField][0] as BaseField}
              onSubmit={field => {
                actions.setField({ field });
                actions.setFieldSelector({ selector: field.selector });
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

// @todo I think it's clear that this should be a connected component.
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

// @todo for this model in general - be able to select what role is looking at the model
// Listing of all fields under that entity, nesting other components, possibly including itself.
// Will also contain the enumerable fields (allowMultiple) and the call to actions to create more.
// - entity
//   - field A
//     - field A, instance 1
//     - field A, instance 2
//     - add new field A
//  - field B
// ...
// This will be the reference implementation of passing down the correct IDs as this will handle
// the nesting at multiple levels. It will use the props passed to it and compose new props for
// other components to ensure they have enough information to pass to the context hooks to update
// the right values. The DX for this needs to be good.
const EntityView: React.FC = () => <div />;

// A view of a single field instance, with an ID, selector field value and update functions. This will become
// a reference implementation for both the inline field and inline field list components.
const FieldView: React.FC = () => <div />;

// The UI for the selector split out for a whole entity. This will be shared with the field selector as they function
// in much the same way. The UI will be slightly different for the inline selector.
const EntitySelector: React.FC = () => <div />;

// @todo This is sort of the homepage for the selected model. You can see all of the submissions and add a new one.
//   This is a likely candidate for swapping out using profiles. A profile would only need to change the component
//   that is rendered. Something like a Portal could change where it is rendered.
// @todo we need to get this preview model hooked up to a content type (IIIF canvas panel viewer)
const PreviewModel: React.FC<{ currentView: StructureType<'model'> }> = ({ currentView }) => {
  const state = RevisionStore.useStoreState(s => s);
  const actions = RevisionStore.useStoreActions(a => a);

  const revisionCards = useMemo(() => {
    const revArray = Object.values(state.revisions).filter(rev => rev.revision.structureId === currentView.id);

    return revArray.map(rev => ({
      label: rev.revision.label,
      onClick: () => actions.selectRevision({ revisionId: rev.revision.id }),
    }));
  }, [actions, currentView.id, state.revisions]);

  // @todo this can be replaced with animation
  if (state.currentRevision) {
    // @todo continue with form view.
    // - Every document and top level is an entity that cannot be repeated (the doc)
    // - Special case for this top level
    // - Views needed for verbose UI:
    //   - Entity view (listing fields with field instances & entities)
    //   - Field view (showing the input and selector that one field)
    //   - Entity selector
    //   - Finish and save button
    // - Views needed for refined UI:
    //   - Inline field instances (allowMultiple = false, selector = any)
    //   - Add entity and field instances below inline fields
    //   - Inline field instances (selector = null)
    //   - Inline entity and entity instance (where depth = 1 and selector = null)
    //   - Collapsing deeply nested entities into breadcrumb-style labels (while the level allowMultiple=false)
    // @todo option to control above behaviour

    return (
      <BackgroundSplash header={currentView.label} description={currentView.description}>
        <RoundedCard>Current revision</RoundedCard>
      </BackgroundSplash>
    );
  }

  return (
    <BackgroundSplash header={currentView.label} description={currentView.description}>
      <CardDropdown label="Existing submissions" cards={revisionCards} />
      <CardButton
        onClick={() => {
          actions.createRevision({ revisionId: currentView.id, cloneMode: 'FORK_TEMPLATE' });
        }}
      >
        Create new
      </CardButton>
    </BackgroundSplash>
  );
};

// This should be a component on it's own, it's the navigation component pulling all of the UI pieces together.
// It's possible this could be customised, but I don't think it should be.
// @todo split and manage context better.
const Preview: React.FC = () => {
  const captureModel = useCaptureModel();
  const [currentView, { pop, push, idStack }] = useNavigation(captureModel.structure);

  if (!currentView) {
    return null;
  }

  // @todo this can be replaced with animation
  if (currentView.type === 'model') {
    return (
      <RevisionStore.Provider initialData={{ captureModel }}>
        <PreviewModel currentView={currentView} />
      </RevisionStore.Provider>
    );
  }

  // @todo this can be replaced with animation
  return (
    <RevisionStore.Provider initialData={{ captureModel }}>
      {idStack.length ? <button onClick={pop}>back</button> : null}
      <BackgroundSplash header={currentView.label} description={currentView.description}>
        {currentView.type === 'choice'
          ? currentView.items.map((item, idx) => (
              <RoundedCard label={item.label} interactive key={idx} onClick={() => push(item.id)}>
                {item.description}
              </RoundedCard>
            ))
          : null}
      </BackgroundSplash>
    </RevisionStore.Provider>
  );
};

const Export: React.FC = () => {
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
    render: () => <Export />,
  },
];

const ModelEditor: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
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
    <ThemeProvider theme={defaultTheme}>
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
    </ThemeProvider>
  );
};
