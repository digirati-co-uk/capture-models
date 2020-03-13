/* eslint-disable react-hooks/rules-of-hooks */
import { registerRefinement } from '@capture-models/plugin-api';
import { StructureType } from '@capture-models/types';
import React, { useCallback } from 'react';
import { Choice } from '../components/Choice/Choice';
import { RevisionChoicePage } from '../containers/RevisionChoicePage';

const SingleChoice: React.FC<any> = ({ navigation, actions }) => {
  const currentView = (navigation.instance as StructureType<'choice'>).items[0];

  const push = useCallback(
    newId => {
      actions.push(currentView.id);
      actions.push(newId);
    },
    [actions, currentView.id]
  );

  const pop = useCallback(() => {
    actions.goTo(currentView.id);
  }, [actions, currentView.id]);

  if (currentView.type === 'model') {
    return <RevisionChoicePage model={currentView} />;
  }

  return <Choice choice={currentView} onChoice={push} showBackButton={false} onBackButton={pop} />;
};

registerRefinement({
  type: 'choice-navigation',
  name: 'Single top-level choice',
  supports(navigation, { structure }) {
    return structure.type === 'choice' && structure.items.length === 1;
  },
  refine(navigation, actions) {
    return <SingleChoice navigation={navigation} acionts={actions} />;
  },
});
