import { BackgroundSplash, Revisions, RoundedCard, useNavigation } from '@capture-models/editor';
import { CaptureModel } from '@capture-models/types';
import React from 'react';
import { RevisionList } from '../RevisionList/RevisionList';
import { RevisionTopLevel } from '../RevisionTopLevel/RevisionTopLevel';

export const RevisionNavigation: React.FC<{ structure: CaptureModel['structure'] }> = ({ structure }) => {
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
