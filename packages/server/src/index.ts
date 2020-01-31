import { couch } from './couch';

// @todo make anything else.
// const couch = new NodeCouchDb({
//   host: 'localhost',
//   protocol: 'http',
//   port: 5984,
//   auth: {
//     user: 'admin',
//     pass: 'password',
//   },
// });

const DB_NAME = 'capture-models';

// "Migrations"
(async () => {
  const dbs = await couch.db.list();

  if (dbs.indexOf(DB_NAME) === -1) {
    console.log(`Creating new database ${DB_NAME}`);
    await couch.db.create(DB_NAME);
  } else {
    console.log(`The database ${DB_NAME} already exists`);
  }

  await import('./app');
})();
