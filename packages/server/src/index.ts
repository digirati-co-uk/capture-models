import { CaptureModelDatabase } from '@capture-models/database';
import { createApp } from './app';
import { config, port } from './config';
import { router } from './router';

async function main() {
  const db = await CaptureModelDatabase.create(config);
  const app = await createApp(db, router);

  app.listen(port);

  if (process.env.NODE_ENV !== 'production') {
    console.log(`Server ready at: http://localhost:3000`);
  }
}

main().catch(err => {
  throw err;
});
