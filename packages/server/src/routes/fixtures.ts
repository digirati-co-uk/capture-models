import { readdirSync } from 'fs';
import * as path from 'path';
import { RouteMiddleware } from '../types';

export const testFixture: RouteMiddleware<{ name: string; file: string }> = async (ctx, next) => {
  try {
    const model = require(`../../../../fixtures/${ctx.params.name}/${ctx.params.file}.json`);
    if (Object.keys(model).length === 0) {
      ctx.res.statusCode = 404;
      return;
    }
    await ctx.db.api.saveCaptureModel(model, { context: ctx.state.jwt.context, user: ctx.state.jwt.user });

    return ctx.redirect(ctx.routes.url('capture-model', { id: model.id }));
  } catch (err) {
    ctx.res.statusCode = 404;
  }
};

export const fixtures: RouteMiddleware = async ctx => {
  ctx.body = readdirSync(path.join(__dirname, '../../../../fixtures'))
    .filter(name => name !== 'simple.json')
    .map(name => ({
      name,
      items: readdirSync(path.join(__dirname, `../../../../fixtures/${name}`)).map(file => ({
        name: file,
        url: ctx.routes.url('test-fixture', { name, file: file.slice(0, -5) }),
      })),
    }));
};
