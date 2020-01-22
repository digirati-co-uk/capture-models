// Middleware 1: JWT/Cookie/no-JWT to this:
import Koa from 'koa';
import json from 'koa-json';
import Router from '@koa/router';
import logger from 'koa-logger';
import { StoredCaptureModel } from '../src/types/capture-model';
import { couch } from './couch';

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
        role: string; // @todo use types for roles.
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
// Key = [ site, ...scope, resource ];

// Create functions to filter capture models.

// Getting list of models.
router.get('/models', async ctx => {
  const db = await couch.db.use<StoredCaptureModel>('capture-models');

  const models = await db.list();

  ctx.body = {
    models: await Promise.all(
      models.rows.map(async r => {
        const { _id, _rev, ...model } = await db.get(r.id, { rev: r.value ? r.value.rev : undefined });
        return {
          id: `${ctx.request.origin}${router.url('model', { id: _id })}`,
          ...model,
        };
      })
    ),
  };
});

// Getting model directly.
router.get('model', '/models/:id', async ctx => {
  const db = await couch.db.use<StoredCaptureModel>('capture-models');
  try {
    const { _id, _rev, ...model } = await db.get(ctx.params.id);
    ctx.body = {
      id: `${ctx.request.origin}${router.url('model', { id: _id })}`,
      ...model,
    };
  } catch (err) {
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

app.listen(3000);
