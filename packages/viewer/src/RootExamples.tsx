import { CardButton, Heading, Revisions, RoundedCard } from '@capture-models/editor';
import { CanvasPanel } from '@capture-models/editor/lib/content-types/CanvasPanel/CanvasPanel';
import { useContentType } from '@capture-models/plugin-api';
import { CaptureModel } from '@capture-models/types';
import { ContentLayout, RootLayout } from '@layouts/core';
import React, { Suspense, useEffect, useState } from 'react';
import { RevisionNavigation } from './components/RevisionNavigation/RevisionNavigation';
import { getExampleContent } from './utility/get-example-content';
import { getExampleModels } from './utility/get-example-models';

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

const Root: React.FC<any> = ({
  selectedCaptureModel,
  setSelectedCaptureModel,
  selectedContent,
  setSelectedContent,
  backHome,
}) => {
  const contentComponent = useContentType(selectedCaptureModel ? selectedCaptureModel.target : undefined);

  useEffect(() => {
    setSelectedCaptureModel(examples[16]);
  })

  return (
    <RootLayout>
      <ContentLayout
        rightSidebar={
          <>
            <button onClick={backHome}>Back home</button>
            {selectedCaptureModel ? (
              selectedContent || contentComponent ? (
                <RevisionNavigation structure={selectedCaptureModel.structure} />
              ) : (
                'Select content'
              )
            ) : (
              <div style={{ padding: '40px 20px', background: '#d0cce2', height: '100%', overflowY: 'auto' }}>
                {examples.map((example, key) => (
                  <RoundedCard key={key}>
                    <Heading size="small">{example.structure.label} ({key})</Heading>
                    <p>{example.structure.description}</p>
                    {example.target ? (
                      <p style={{ fontSize: 11, color: '#999' }}>
                        {example.target.map((t, k) => {
                          return (
                            <>
                              <span key={k}>{t.id}</span>
                              <br />
                            </>
                          );
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
