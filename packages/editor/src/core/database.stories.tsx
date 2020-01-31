import React from 'react';
import { DatabaseProvider, useAllDocs, useDatabase } from './database';

const withSimpleDatabase = (Component: React.FC): React.FC => () => (
  <DatabaseProvider databaseName="test-with-simple-database">
    <Component />
  </DatabaseProvider>
);

export default {
  title: 'Core|Database',
};

export const Nested: React.FC = withSimpleDatabase(() => {
  const db = useDatabase();
  const docs = useAllDocs<{ label: string }>();

  return (
    <div>
      {docs.map(doc => (
        <div key={doc._id}>
          {doc.label}
          <button onClick={() => db.remove({ _id: doc._id, _rev: doc._rev })}>Remove</button>
        </div>
      ))}
      <button onClick={() => db.post({ label: `Number ${docs.length}` })}>Add</button>
    </div>
  );
});
