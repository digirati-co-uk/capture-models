import { CardButton, Heading, Revisions, RoundedCard } from '@capture-models/editor';
import { CanvasPanel } from '@capture-models/editor/lib/content-types/CanvasPanel/CanvasPanel';
import { useContentType } from '@capture-models/plugin-api';
import { ContentLayout, RootLayout } from '@layouts/core';
import React, { Suspense } from 'react';
import { RevisionNavigation } from '../components/RevisionNavigation/RevisionNavigation';
import { createRevision } from '../utility/create-revision';
import { getExampleContent } from '../utility/get-example-content';
import { updateRevision } from '../utility/update-revision';
import { useApiModels } from '../utility/useModels';

const content = getExampleContent();

// @todo
//  - Mock config API
//  - Choosen IIIF content + Capture model
//  - Mock what Omeka does when creating capture model that does not exist. (admin JWT will work on FE)
//  - Show page with fresh capture model from template
//  - Allow saving of revisions, as normal
//  - Start UI refinements
export const Viewer: React.FC<any> = ({
  selectedCaptureModel,
  setSelectedCaptureModel,
  selectedContent,
  setSelectedContent,
  backHome,
}) => {
  const models = useApiModels();
  const contentComponent = useContentType(selectedCaptureModel ? selectedCaptureModel.target : undefined);
  const deselect = Revisions.useStoreActions(a => a.deselectRevision);
  const persistRevision = Revisions.useStoreActions(a => a.persistRevision);

  return (
    <RootLayout>
      <ContentLayout
        rightSidebar={
          <>
            <button onClick={backHome}>Back home</button>
            {selectedCaptureModel ? (
              selectedContent || contentComponent ? (
                <RevisionNavigation
                  onSaveRevision={rev => {
                    persistRevision({ createRevision, updateRevision, revisionId: rev.revision.id }).then(() => {
                      deselect({ revisionId: rev.revision.id });
                    });
                  }}
                  structure={selectedCaptureModel.structure}
                />
              ) : (
                'Select content'
              )
            ) : (
              <div style={{ padding: '40px 20px', background: '#d0cce2', height: '100%', overflowY: 'auto' }}>
                {models.map((example, key) => (
                  <RoundedCard key={key}>
                    <Heading size="small">{example.label}</Heading>
                    <CardButton inline size="medium" onClick={() => setSelectedCaptureModel(example.id)}>
                      Choose model {!selectedContent && 'and content'}
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
