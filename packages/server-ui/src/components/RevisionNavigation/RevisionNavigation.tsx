import { BackgroundSplash, Revisions, RoundedCard, useNavigation } from '@capture-models/editor';
import { CaptureModel, RevisionRequest } from '@capture-models/types';
import React from 'react';
import { Choice } from '../Choice/Choice';
import { RevisionList } from '../RevisionList/RevisionList';
import { RevisionTopLevel } from '../RevisionTopLevel/RevisionTopLevel';
import { TabNavigation } from '../TabNavigation/TabNavigation';

export const RevisionNavigation: React.FC<{
  structure: CaptureModel['structure'];
  onSaveRevision: (req: RevisionRequest) => void;
}> = ({ structure, onSaveRevision }) => {
  const [currentView, { pop, push, idStack }] = useNavigation(structure);
  const currentRevisionId = Revisions.useStoreState(s => s.currentRevisionId);
  const readMode = Revisions.useStoreState(s => s.currentRevisionReadMode);

  if (!currentView) {
    return null;
  }

  if (currentRevisionId) {
    return <RevisionTopLevel onSaveRevision={onSaveRevision} readMode={readMode} />;
  }

  if (structure.profile && structure.profile.indexOf('tabs') !== -1 && structure.type !== 'model') {
    return (
      <>
        <TabNavigation onChoice={push} currentId={currentView.id} choice={structure} />
        {currentView.type === 'model' ? <RevisionList model={currentView} /> : null}
      </>
    );
  }

  if (currentView.type === 'model') {
    return <RevisionList model={currentView} />;
  }

  return <Choice choice={currentView} onBackButton={pop} onChoice={push} showBackButton={idStack.length > 0} />;
};
