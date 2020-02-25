import { CaptureModelDatabase } from '@capture-models/database';
import Koa from 'koa';
import json from 'koa-json';
import logger from 'koa-logger';
import { TypedRouter } from './utility/typed-router';

export async function createApp(db: CaptureModelDatabase, router: TypedRouter<any, any>) {
  const app = new Koa();

  app.context.routes = router;
  app.context.db = db;

  app.use(json({ pretty: process.env.NODE_ENV !== 'production' }));
  app.use(logger());
  app.use(router.routes()).use(router.allowedMethods());

  return app;
}
