import { BackgroundSplash, Revisions, RoundedCard, useNavigation } from '@capture-models/editor';
import { useRefinement } from '@capture-models/plugin-api';
import { CaptureModel, ChoiceRefinement, RevisionRequest } from '@capture-models/types';
import React from 'react';
import { Choice } from '../Choice/Choice';
import { RevisionList } from '../RevisionList/RevisionList';
import { RevisionTopLevel } from '../RevisionTopLevel/RevisionTopLevel';
import { TabNavigation } from '../TabNavigation/TabNavigation';

export const RevisionNavigation: React.FC<{
  structure: CaptureModel['structure'];
  onSaveRevision: (req: RevisionRequest) => Promise<void>;
}> = ({ structure, onSaveRevision }) => {
  const [currentView, { pop, push, idStack, goTo }] = useNavigation(structure);
  const currentRevisionId = Revisions.useStoreState(s => s.currentRevisionId);
  const readMode = Revisions.useStoreState(s => s.currentRevisionReadMode);
  const refinement = useRefinement<ChoiceRefinement>(
    'choice-navigation',
    { instance: currentView, property: '' },
    { currentRevisionId, structure }
  );

  if (!currentView) {
    return null;
  }

  if (currentRevisionId) {
    return (
      <RevisionTopLevel onSaveRevision={onSaveRevision} instructions={currentView.description} readOnly={readMode} />
    );
  }

  if (refinement) {
    return refinement.refine(
      { instance: currentView, property: '' },
      { readOnly: readMode, currentRevisionId, pop, push, idStack, goTo, structure }
    );
  }

  if (currentView.type === 'model') {
    return <RevisionList goBack={pop} model={currentView} />;
  }

  return <Choice choice={currentView} onBackButton={pop} onChoice={push} showBackButton={idStack.length > 0} />;
};
