import { isEmptyRevision } from '@capture-models/helpers';
import { registerRefinement } from '@capture-models/plugin-api';
import React, { useMemo } from 'react';
import { RevisionList, RevisionListProps } from '../components/RevisionList/RevisionList';

const FilteredRevisionList: React.FC<RevisionListProps> = props => {
  const filteredRevisions = useMemo(() => props.revisions.filter(revision => !isEmptyRevision(revision)), [
    props.revisions,
  ]);

  return <RevisionList model={props.model} {...props} revisions={filteredRevisions} />;
};

registerRefinement({
  name: 'Hide empty structure revisions',
  type: 'revision-list',
  supports({ instance }, { revisions }) {
    for (const revision of revisions) {
      if (isEmptyRevision(revision)) {
        return true;
      }
    }
    return false;
  },
  refine({ instance: model }, props) {
    return <FilteredRevisionList model={model} {...props} />;
  },
});
