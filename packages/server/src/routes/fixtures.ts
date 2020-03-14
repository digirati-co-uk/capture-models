import { readdirSync, readFileSync } from 'fs';
import * as path from 'path';
import { RouteMiddleware } from '../types';

const fixturePath = process.env.FIXTURE_PATH || path.join(__dirname, '../../../../fixtures');

export const testFixture: RouteMiddleware<{ name: string; file: string }> = async (ctx, next) => {
  try {
    const model = JSON.parse(
      readFileSync(path.join(fixturePath, ctx.params.name, `${ctx.params.file}.json`)).toString()
    );
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
  try {
    ctx.body = readdirSync(fixturePath)
      .filter(name => name !== 'simple.json')
      .map(name => ({
        name,
        items: readdirSync(path.join(fixturePath, name)).map(file => ({
          name: file,
          url: ctx.routes.url('test-fixture', { name, file: file.slice(0, -5) }),
        })),
      }));
  } catch (e) {
    ctx.body = [];
  }
};
