import React, { useEffect, useMemo, useRef } from 'react';
import { Link, Route, Switch, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { Card, Grid, Header, Menu, Segment, Tab } from 'semantic-ui-react';
import { ThemeProvider } from 'styled-components';
import { useDebouncedCallback } from 'use-debounce';
import {
  CaptureModelList,
  DocumentEditor,
  EditorContext,
  useCaptureModel,
  FieldEditor,
  StructureEditor,
  DocumentStore,
  StructureStore,
  useFocusedStructureEditor,
  useNavigation,
  defaultTheme,
  BackgroundSplash,
  RoundedCard,
  Revisions as RevisionStore,
  CardDropdown,
  CardButton,
} from '@capture-models/editor';
import { BaseField, CaptureModel, StructureType } from '@capture-models/types';
import { useApiModel, useApiModels } from './utility/useModels';

const ctx = require.context('../../../fixtures', true, /\.json$/);

export function getExampleModels(): CaptureModel[] {
  return ctx
    .keys()
    .map(key => ctx(key))
    .filter(model => Object.keys(model).length)
    .map(model => {
      if (model.structure && model.structure.id === undefined) {
        model.structure.description += ' – WARNING: NO IDS, EDITING WILL NOT WORK';
      }
      return model;
    }) as CaptureModel[];
}

const Models = () => {
  const models = useApiModels();
  const history = useHistory();

  return (
    <Card.Content>
      <CaptureModelList
        captureModels={models}
        onClick={e => history.push(`/editor/${e}`)}
        onDelete={e => {
          console.log('removed', e);
          // db.remove({ _id: e._id as string, _rev: e._rev as string })
          // @todo
        }}
      />
      <button
        onClick={() => {
          console.log('create model');
          // @todo
          // db.post<CaptureModel>({
          //   structure: createChoice({ label: 'Untitled model' }),
          //   document: createDocument(),
          // });
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
          setAllowMultiple={actions.setAllowMultiple}
          setLabelledBy={actions.setLabelledBy}
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
              onChangeFieldType={(type, defaults) => {
                actions.setFieldType({
                  type,
                  defaults,
                });
                actions.deselectField();
              }}
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
    render: function fullDoc() {
      return <FullDocumentEditor />;
    },
  },
  {
    menuItem: 'Structure',
    render: function fullStruc() {
      return <FullStructureEditor />;
    },
  },
  {
    menuItem: 'Preview',
    render: function prev() {
      return <Preview />;
    },
  },
  {
    menuItem: 'Export',
    render: function exportModel() {
      return <Export />;
    },
  },
];

const ModelEditor: React.FC = () => {
  const match = useRouteMatch<{ id: string }>();
  const id = match.params.id;
  const model = useApiModel(id);
  const rev = useRef<string>('');

  useEffect(() => {
    // @TODO
    // db.get<CaptureModel>(id).then(m => {
    //   rev.current = m._rev;
    //   setModel(m);
    // });
  }, [id]);

  const [onDocumentChange] = useDebouncedCallback((doc: CaptureModel['document']) => {
    // @todo.
    // if (model && rev) {
    //   db.post<CaptureModel>({
    //     ...model,
    //     _rev: rev.current,
    //     document: doc,
    //   }).then(resp => {
    //     rev.current = resp.rev;
    //     setModel({
    //       ...model,
    //       _rev: resp.rev,
    //       document: doc,
    //     });
    //   });
    // }
  }, 1000);

  const [onStructureChange] = useDebouncedCallback((structure: CaptureModel['structure']) => {
    if (model && rev) {
      // db.post<CaptureModel>({
      //   ...model,
      //   _rev: rev.current,
      //   structure,
      // }).then(resp => {
      //   rev.current = resp.rev;
      //   setModel({
      //     ...model,
      //     _rev: resp.rev,
      //     structure,
      //   });
      // });
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
// const ModelEditorWithRouter = ModelEditor;

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
        <Switch>
          <Route path="/editor" exact>
            <Models />
          </Route>

          <Route path="/editor/:id">
            <ModelEditor />
          </Route>
        </Switch>
      </div>
    </ThemeProvider>
  );
};
