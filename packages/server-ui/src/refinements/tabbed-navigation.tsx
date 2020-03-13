import { registerRefinement } from '@capture-models/plugin-api';
import React from 'react';
import { RevisionList } from '../components/RevisionList/RevisionList';
import { TabNavigation } from '../components/TabNavigation/TabNavigation';

registerRefinement({
  type: 'choice-navigation',
  name: 'Tabbed navigation profile',
  supports(currentView, { structure }) {
    return !!structure.profile && structure.profile.indexOf('tabs') !== -1 && structure.type !== 'model';
  },
  refine(currentView, { push, structure }) {
    if (structure.type === 'model') {
      // Should not happen.
      return null;
    }
    return (
      <>
        <TabNavigation onChoice={push} currentId={currentView.instance.id} choice={structure} />
        {currentView.instance.type === 'model' ? <RevisionList model={currentView.instance} /> : null}
      </>
    );
  },
});
