import { CaptureModelDatabase } from '@capture-models/database';
import { createApp } from './app';
import { config, port } from './config';
import { router } from './router';

// @ts-ignore
global.window = typeof global.window === 'undefined' ? {} : global.window;

import '@capture-models/editor/lib/input-types/TextField';

async function main() {
  console.log('Connecting to database...');
  const db = await CaptureModelDatabase.create(config);
  const app = await createApp(db, router);

  console.log('Synchronising database...');
  await db.synchronize();

  console.log('Running migrations...');
  await db.runMigrations();

  console.log(`Listening on port ${port}`);
  app.listen(port);

  if (process.env.NODE_ENV !== 'production') {
    console.log(`Server ready at: http://localhost:3000`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
