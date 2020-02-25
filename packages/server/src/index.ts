import { CaptureModelDatabase } from '@capture-models/database';
import { createApp } from './app';
import { config, port } from './config';
import { router } from './router';

async function main() {
  const db = await CaptureModelDatabase.create(config);
  const app = await createApp(db, router);

  app.listen(port);
}

main().catch(err => {
  throw err;
});
