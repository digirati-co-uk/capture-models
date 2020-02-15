import {
  BackgroundSplash,
  CardButton,
  Heading,
  RevisionStore,
  RoundedCard,
  useNavigation,
} from '@capture-models/editor';
import { CaptureModel } from '@capture-models/types';
import { ContentLayout, RootLayout } from '@layouts/core';
import React, { useState } from 'react';
import { getExampleContent } from './utility/get-example-content';
import { getExampleModels } from './utility/get-example-models';
import { CanvasPanel } from '@capture-models/editor/lib/content-types/CanvasPanel/CanvasPanel';

const examples = getExampleModels();
const content = getExampleContent();

const Nav: React.FC<{ structure: CaptureModel['structure'] }> = ({ structure }) => {
  const [currentView, { pop, push, idStack }] = useNavigation(structure);

  if (!currentView) {
    return null;
  }

  return (
    <>
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
    </>
  );
};

const Root: React.FC<any> = ({
  selectedCaptureModel,
  setSelectedCaptureModel,
  selectedContent,
  setSelectedContent,
}) => {
  return (
    <RootLayout>
      <ContentLayout
        rightSidebar={
          <>
            {selectedCaptureModel ? (
              <Nav structure={selectedCaptureModel.structure} />
            ) : (
              <div style={{ padding: '40px 20px', background: '#d0cce2', height: '100%' }}>
                {examples.map((example, key) => (
                  <div key={key}>
                    <Heading size="medium">{example.structure.label}</Heading>
                    <p>{example.structure.description}</p>
                    <CardButton onClick={() => setSelectedCaptureModel(example)}>Choose model</CardButton>
                  </div>
                ))}
              </div>
            )}
          </>
        }
      >
        {selectedContent ? (
          <>
            <Heading size="medium">{selectedContent.label}</Heading>
            {selectedCaptureModel ? (
              <CanvasPanel canvasId={''} manifestId={selectedContent.manifest} />
            ) : (
              'Select content.'
            )}
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

  if (selectedCaptureModel) {
    return (
      <RevisionStore.Provider initialData={{ captureModel: selectedCaptureModel }}>
        <Root
          selectedCaptureModel={selectedCaptureModel}
          setSelectedCaptureModel={setSelectedCaptureModel}
          selectedContent={selectedContent}
          setSelectedContent={setSelectedContent}
        />
      </RevisionStore.Provider>
    );
  }
  return (
    <Root
      selectedCaptureModel={selectedCaptureModel}
      setSelectedCaptureModel={setSelectedCaptureModel}
      selectedContent={selectedContent}
      setSelectedContent={setSelectedContent}
    />
  );
};
