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

export const Viewer: React.FC<any> = ({
  selectedCaptureModel,
  setSelectedCaptureModel,
  selectedContent,
  setSelectedContent,
  backHome,
}) => {
  const models = useApiModels();
  const contentComponent = useContentType(selectedCaptureModel ? selectedCaptureModel.target : undefined);
  const currentId = Revisions.useStoreState(s => s.currentRevisionId);
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
                    {/*<p>{example.structure.description}</p>*/}
                    {/*{example.target ? (*/}
                    {/*  <p style={{ fontSize: 11, color: '#999' }}>*/}
                    {/*    {example.target.map((t, k) => {*/}
                    {/*      return (*/}
                    {/*        <>*/}
                    {/*          <span key={k}>{t.id}</span>*/}
                    {/*          <br />*/}
                    {/*        </>*/}
                    {/*      );*/}
                    {/*    })}*/}
                    {/*  </p>*/}
                    {/*) : null}*/}
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
