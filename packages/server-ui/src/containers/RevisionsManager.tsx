import React from 'react';
import { useRevisionList } from '../utility/useModels';

export const RevisionsManager: React.FC = () => {
  const revisions = useRevisionList();

  return (
    <div>
      <ul>
        {revisions.map((revision, idx) => {
          return <li key={idx}>{revision.label}</li>;
        })}
      </ul>
    </div>
  );
};
