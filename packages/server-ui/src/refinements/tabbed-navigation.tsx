import { registerRefinement } from '@capture-models/plugin-api';
import React from 'react';
import { TabNavigation } from '../components/TabNavigation/TabNavigation';
import { RevisionChoicePage } from '../containers/RevisionChoicePage';
import { RevisionTopLevel } from '../components/RevisionTopLevel/RevisionTopLevel';

registerRefinement({
  type: 'choice-navigation',
  name: 'Tabbed navigation profile',
  supports(currentView, { structure, currentRevisionId }) {
    return !!structure.profile && structure.profile.indexOf('tabs') !== -1 && structure.type !== 'model';
  },
  refine({ instance: currentView }, context) {
    if (context.structure.type === 'model') {
      // Should not happen.
      return null;
    }

    return (
      <>
        <TabNavigation onChoice={context.push} currentId={currentView.id} choice={context.structure} />
        {context.currentRevisionId ? (
          <RevisionTopLevel
            onSaveRevision={context.onSaveRevision}
            instructions={
              currentView.type === 'model' && currentView.instructions
                ? currentView.instructions
                : currentView.description
            }
            readOnly={context.readMode || false}
          />
        ) : (
          currentView.type === 'model' ? <RevisionChoicePage model={currentView} /> : null
        )}
      </>
    );
  },
});
