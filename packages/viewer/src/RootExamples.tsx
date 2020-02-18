import {
  BackgroundSplash,
  CardButton,
  FieldHeaderComponent,
  isEntityList,
  Heading,
  Revisions,
  RoundedCard,
  useNavigation,
  CardButtonGroup,
  FieldWrapper,
  useChoiceRevisions,
  FieldPreview,
  DocumentPreview
} from '@capture-models/editor';
import { useContentType } from '@capture-models/plugin-api';
import { BaseField, CaptureModel, StructureType } from '@capture-models/types';
import { ContentLayout, RootLayout } from '@layouts/core';
import React, { useState, Suspense } from 'react';
import { getExampleContent } from './utility/get-example-content';
import { getExampleModels } from './utility/get-example-models';
import { CanvasPanel } from '@capture-models/editor/lib/content-types/CanvasPanel/CanvasPanel';

const examples = getExampleModels();
const content = getExampleContent();

// Routes:
// /browse/{id[]}
// /revision/{id}
// /revision/{id}/field/{id}
// /revision/{id}/field/{id}/selector
// /revision/{id}/doc/{id}
// /revision/{id}/doc/{id}/selector
// /revision/{id}/preview
// /revision/{id}/export

// Things:
// - field index: id => [id, id, id]: computed field on revision

const FieldInstanceList: React.FC<{
  fields: Array<BaseField>;
  property: string;
  chooseField: (field: { property: string; instance: BaseField }) => void;
}> = ({ fields, chooseField, property }) => {
  return (
    <>
      {fields.map((field, idx) => {
        return (
          <RoundedCard
            key={idx}
            size="small"
            interactive={true}
            onClick={() => chooseField({ instance: field, property })}
          >
            <FieldPreview field={field} />
          </RoundedCard>
        );
      })}
    </>
  );
};

const EntityInstanceList: React.FC<{
  entities: Array<CaptureModel['document']>;
  property: string;
  chooseEntity: (field: { property: string; instance: CaptureModel['document'] }) => void;
}> = ({ entities, chooseEntity, property }) => {
  return (
    <>
      {entities.map((field, idx) => {
        return (
          <RoundedCard key={idx} interactive={true} onClick={() => chooseEntity({ instance: field, property })}>
            <DocumentPreview entity={field}>
              Field number {idx} (type: {field.type})
            </DocumentPreview>
          </RoundedCard>
        );
      })}
    </>
  );
};

const FieldList: React.FC<{
  document: CaptureModel['document'];
  chooseField: (field: { property: string; instance: BaseField }) => void;
  chooseEntity: (field: { property: string; instance: CaptureModel['document'] }) => void;
}> = ({ document, chooseField, chooseEntity }) => {
  return (
    <RoundedCard>
      {Object.keys(document.properties).map((propertyId, idx) => {
        const instances = document.properties[propertyId];
        if (isEntityList(instances)) {
          const entity = instances[0];
          return (
            <div key={idx}>
              <FieldHeaderComponent label={entity.label || 'Untitled'} />
              <EntityInstanceList entities={instances} property={propertyId} chooseEntity={chooseEntity} />
            </div>
          );
        }
        const field = instances[0];
        return (
          <div key={idx}>
            <FieldHeaderComponent label={field.label} />
            <FieldInstanceList fields={instances} property={propertyId} chooseField={chooseField} />
          </div>
        );
      })}
    </RoundedCard>
  );
};

const RevisionList: React.FC<{ model: StructureType<'model'> }> = ({ model }) => {
  const revisions = useChoiceRevisions(model.id);
  const selectRevision = Revisions.useStoreActions(a => a.selectRevision);
  const createRevision = Revisions.useStoreActions(a => a.createRevision);

  return (
    <BackgroundSplash header={model.label} description={model.description}>
      {revisions.map((rev, idx) => (
        <RoundedCard
          label={rev.revision.label || rev.revision.id}
          interactive
          key={idx}
          onClick={() => selectRevision({ revisionId: rev.revision.id })}
        >
          {rev.revision.approved ? 'Approved' : 'Draft'}
        </RoundedCard>
      ))}
      <CardButtonGroup>
        <CardButton onClick={() => createRevision({ revisionId: model.id, cloneMode: 'FORK_ALL_VALUES' })}>
          Edit
        </CardButton>
        <CardButton onClick={() => createRevision({ revisionId: model.id, cloneMode: 'FORK_TEMPLATE' })}>
          Create new
        </CardButton>
      </CardButtonGroup>
    </BackgroundSplash>
  );
};

const VerboseFieldPage: React.FC<{
  field: { property: string; instance: BaseField };
  path: Array<[string, string]>;
  goBack: () => void;
}> = ({ field, path, goBack }) => {
  const [value, setValue] = useState(field.instance.value);
  const updateFieldValue = Revisions.useStoreActions(a => a.updateFieldValue);
  const selector = Revisions.useStoreState(s =>
    field.instance.selector
      ? s.selector.availableSelectors.find(({ id }) =>
          field.instance.selector ? id === field.instance.selector.id : false
        )
      : undefined
  );

  return (
    <BackgroundSplash header={field.instance.label}>
      <RoundedCard size="small">
        <FieldWrapper field={field.instance} selector={selector} onUpdateValue={setValue} />
      </RoundedCard>
      <CardButton
        onClick={() => {
          updateFieldValue({ path, value });
          goBack();
        }}
      >
        Finish and save
      </CardButton>
    </BackgroundSplash>
  );
};

const VerboseEntityPage: React.FC<{
  entity: { property: string; instance: CaptureModel['document'] };
  path: Array<[string, string]>;
  goBack: () => void;
}> = ({ entity, path, goBack }) => {
  const [selectedField, setSelectedField] = useState<{ property: string; instance: BaseField }>();
  const [selectedEntity, setSelectedEntity] = useState<{ property: string; instance: CaptureModel['document'] }>();

  if (selectedField) {
    return (
      <VerboseFieldPage
        field={selectedField}
        path={[...path, [selectedField.property, selectedField.instance.id]]}
        goBack={() => setSelectedField(undefined)}
      />
    );
  }

  if (selectedEntity) {
    return (
      <VerboseEntityPage
        entity={selectedEntity}
        path={[...path, [selectedEntity.property, selectedEntity.instance.id]]}
        goBack={() => setSelectedEntity(undefined)}
      />
    );
  }

  return (
    <BackgroundSplash header={entity.instance.label || 'New revision'}>
      <FieldList document={entity.instance} chooseEntity={setSelectedEntity} chooseField={setSelectedField} />
      <CardButton onClick={() => goBack()}>Finish and save</CardButton>
    </BackgroundSplash>
  );
};

const RevisionTopLevel: React.FC = () => {
  const current = Revisions.useStoreState(s => s.currentRevision);
  if (!current) return null;

  return (
    <>
      <VerboseEntityPage
        entity={{ property: 'root', instance: current.document }}
        path={[]}
        goBack={() => console.log('Whole revision!', current)}
      />
    </>
  );
};

const Nav: React.FC<{ structure: CaptureModel['structure'] }> = ({ structure }) => {
  const [currentView, { pop, push, idStack }] = useNavigation(structure);
  const currentRevisionId = Revisions.useStoreState(s => s.currentRevisionId);

  if (!currentView) {
    return null;
  }

  if (currentRevisionId) {
    return <RevisionTopLevel />;
  }

  if (currentView.type === 'model') {
    return <RevisionList model={currentView} />;
  }

  return (
    <>
      {idStack.length ? <button onClick={pop}>back</button> : null}
      <BackgroundSplash header={currentView.label} description={currentView.description}>
        {currentView.type === 'choice' ? (
          currentView.items.map((item, idx) => (
            <RoundedCard key={idx} label={item.label} interactive onClick={() => push(item.id)}>
              {item.description}
            </RoundedCard>
          ))
        ) : (
          <RevisionList model={currentView} />
        )}
      </BackgroundSplash>
    </>
  );
};

const Root: React.FC<any> = ({
  selectedCaptureModel,
  setSelectedCaptureModel,
  selectedContent,
  setSelectedContent,
  backHome,
}) => {
  const contentComponent = useContentType(selectedCaptureModel ? selectedCaptureModel.target : undefined);
  return (
    <RootLayout>
      <ContentLayout
        rightSidebar={
          <>
            <button onClick={backHome}>Back home</button>
            {selectedCaptureModel ? (
              selectedContent || contentComponent ? (
                <Nav structure={selectedCaptureModel.structure} />
              ) : (
                'Select content'
              )
            ) : (
              <div style={{ padding: '40px 20px', background: '#d0cce2', height: '100%', overflowY: 'auto' }}>
                {examples.map((example, key) => (
                  <RoundedCard key={key}>
                    <Heading size="small">{example.structure.label}</Heading>
                    <p>{example.structure.description}</p>
                    {example.target ? (
                      <p style={{ fontSize: 11, color: '#999' }}>
                        {example.target.map((t, k) => {
                          return <div key={k}>{t.id}</div>;
                        })}
                      </p>
                    ) : null}
                    <CardButton inline size="medium" onClick={() => setSelectedCaptureModel(example)}>
                      Choose model {!selectedContent && example.target && 'and content'}
                    </CardButton>
                  </RoundedCard>
                ))}
              </div>
            )}
          </>
        }
      >
        {selectedContent || contentComponent ? (
          <>
            <Suspense fallback={'loading...'}>
              {selectedCaptureModel && selectedContent ? (
                <CanvasPanel canvasId={''} manifestId={selectedContent.manifest} />
              ) : contentComponent ? (
                contentComponent
              ) : (
                'Select model.'
              )}
            </Suspense>
          </>
        ) : (
          <div style={{ padding: 40 }}>
            {content.map(({ label, manifest, thumbnail }, key) => (
              <RoundedCard key={key}>
                <div style={{ display: 'flex' }}>
                  {thumbnail ? (
                    <div style={{ textAlign: 'center', width: 150, marginRight: 30 }}>
                      <img alt={label} src={thumbnail} />{' '}
                    </div>
                  ) : null}
                  <div>
                    <Heading size="medium">{label}</Heading>
                    <p>{manifest}</p>
                    <CardButton inline onClick={() => setSelectedContent({ label, manifest, thumbnail })}>
                      Choose content
                    </CardButton>
                  </div>
                </div>
              </RoundedCard>
            ))}
          </div>
        )}
      </ContentLayout>
    </RootLayout>
  );
};

export const RootExamples: React.FC = () => {
  const [selectedContent, setSelectedContent] = useState<{ label: string; manifest: string; thumbnail?: string }>();
  const [selectedCaptureModel, setSelectedCaptureModel] = useState<CaptureModel>();

  return (
    <Revisions.Provider captureModel={selectedCaptureModel}>
      <Root
        backHome={() => {
          setSelectedContent(undefined);
          setSelectedCaptureModel(undefined);
        }}
        selectedCaptureModel={selectedCaptureModel}
        setSelectedCaptureModel={setSelectedCaptureModel}
        selectedContent={selectedContent}
        setSelectedContent={setSelectedContent}
      />
    </Revisions.Provider>
  );
};
