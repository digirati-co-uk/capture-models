// Middleware 1: JWT/Cookie/no-JWT to this:
import Koa from 'koa';
import json from 'koa-json';
import Router from '@koa/router';
import logger from 'koa-logger';
import { CaptureModelDatabase } from '@capture-models/database';

const app = new Koa();
const router = new Router();

type UserScope = {
  resource: { id: string };
  site: string;
  scope: string[];
} & (
  | {
      anonymous: true;
    }
  | {
      anonymous: false;
      user: {
        id: string;
        role: string; // @todo use @types for roles.
      };
    }
);

// Create mock of config service (JS API with async await)
type ConfigResponse<T> = {
  config_key: string; // The found key, which can be compared to the requested one. e.g. a|b|c -> a|b
  config_value: T;
  requested_context: string[];
  requested_service: string;
  keys_searched: string[];
};

async function main() {
  const database = await CaptureModelDatabase.create({
    host: 'localhost',
    port: 5432,
    name: 'default',
    username: 'postgres',
    database: 'postgres',
    schema: 'public',
    synchronize: true,
    logging: false,
  });

  // Sync on start.
  await database.synchronize();

  // Key = [ site, ...scope, resource ];

  // Create functions to filter capture models.

  // Getting list of models.
  router.get('/models', async ctx => {
    const models = await database.api.getAllCaptureModels();

    ctx.body = {
      models,
    };
  });

  // Getting model directly.
  router.get('model', '/models/:id', async ctx => {
    try {
      ctx.body = await database.api.getCaptureModel(ctx.params.id);
    } catch (err) {
      console.log('Error while fetching model', err);
      ctx.status = 404;
      return;
    }
  });

  // Ping endpoint.
  router.get('/', ctx => {
    ctx.body = { page: 'index' };
  });

  // Resource endpoint, with all the main logic.
  router.get('resource', ctx => {
    ctx.body = { page: 'resource' };
  });

  //
  // // These might be put into functions and used directly inside of the `router` calls
  // // since not every endpoint may return this.
  // app.use(ctx => {
  //   // Where can the JWT live?
  //   // - Cookie
  //   // - Auth as a Bearer token
  //   //
  //   // Where does the other parts live?
  //   // - Resource
  //   // - Site
  //   // - Scope
  // });
  //
  // app.use(ctx => {
  //   // Building up a config query
  //   // - request: [ site, ...scope, resource ]
  //   // - service: capture-model-service
  //   // - user: user-id
  // });
  //
  // // Post processing
  // app.use(ctx => {
  //   // req.revision filtering
  //   // user filtering
  //   // user + revision validation
  // });

  app.use(json({ pretty: process.env.NODE_ENV !== 'production' }));
  app.use(logger());
  app.use(router.routes()).use(router.allowedMethods());

  if (process.env.NODE_ENV !== 'production') {
    console.log('Starting on http://localhost:3000');
  }
  app.listen(3000);
}

main().catch(err => {
  throw err;
});
