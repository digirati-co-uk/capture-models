// Create context for PouchDB
import PouchDB from 'pouchdb';
import React, { MutableRefObject, useEffect, useState } from 'react';
// Add hook for using Capture model list
// Add functions for creating capture models
import { createContext } from '../utility/create-context';

/**
 * @internal
 * @deprecated
 **/
type DatabaseContext = MutableRefObject<PouchDB.Database>;
/**
 * @internal
 * @deprecated
 **/
type DatabaseProviderProps = {
  databaseName: string;
  databaseOptions?: PouchDB.Configuration.DatabaseConfiguration;
};

/**
 * @internal
 * @deprecated
 **/
const [useContext, InternalDatabaseProvider] = createContext<DatabaseContext>();

/**
 * @internal
 * @deprecated
 **/
export function useDatabase() {
  const db = useContext();

  useEffect(() => {
    const remote = db.current
      .sync('http://admin:password@localhost:5984/capture-models', {
        live: true,
        retry: true,
      })
      .on('change', () => {
        console.log('changed?');
      });
    return () => {
      remote.cancel();
    };
  }, [db]);

  return db.current;
}

/**
 * @internal
 * @deprecated
 **/
export function useAllDocs<T>() {
  const db = useDatabase();
  const [docs, setDocs] = useState<Array<PouchDB.Core.ExistingDocument<T & PouchDB.Core.AllDocsMeta>>>([]);

  useEffect(() => {
    const ids: string[] = [];
    // eslint-disable-next-line @typescript-eslint/camelcase
    db.allDocs<T>({ include_docs: true }).then(({ rows }) => {
      setDocs(
        rows.map(r => r.doc).filter(r => r !== undefined) as Array<
          PouchDB.Core.ExistingDocument<T & PouchDB.Core.AllDocsMeta>
        >
      );
      ids.push(...rows.map(r => r.id));
    });

    const changes = db
      .changes({
        live: true,
        // eslint-disable-next-line @typescript-eslint/camelcase
        include_docs: true,
        since: 'now',
      })
      .on('change', ({ doc }) => {
        if (doc) {
          if (doc._deleted) {
            // delete doc.
            setDocs(innerDocs => innerDocs.filter(innerDoc => innerDoc._id !== doc._id));
            return;
          }
          if (ids.indexOf(doc._id) !== -1) {
            // change doc.
            setDocs(innerDocs => innerDocs.map(innerDoc => (innerDoc._id === doc._id ? doc : innerDoc) as any));
            return;
          }
          // Create doc
          ids.push(doc._id);
          setDocs(innerDocs => [...innerDocs, doc] as any);
          return;
        }
      });

    return () => {
      changes.cancel();
    };
  }, [db]);

  return docs;
}

/**
 * @internal
 * @deprecated
 **/
export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ databaseName, databaseOptions, children }) => {
  const db = React.useRef<PouchDB.Database>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Create database instance.
    db.current = new PouchDB(databaseName, databaseOptions);
    setReady(true);

    return () => {
      if (db.current) {
        db.current.close();
        db.current = undefined;
      }
    };
  }, [databaseName, databaseOptions]);

  if (!ready) {
    return null;
  }

  return (
    <InternalDatabaseProvider value={db as MutableRefObject<PouchDB.Database>}>{children}</InternalDatabaseProvider>
  );
};
