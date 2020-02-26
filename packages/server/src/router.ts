import * as path from 'path';
import { captureModelApi } from './routes/api/capture-model';
import { indexPage } from './routes/view';
import { RouteMiddleware } from './types';
import { TypedRouter } from './utility/typed-router';
import { readdirSync } from 'fs';

const testFixture: RouteMiddleware<{ name: string; file: string }> = async (ctx, next) => {
  try {
    const model = require(`../../../fixtures/${ctx.params.name}/${ctx.params.file}.json`);
    if (Object.keys(model).length === 0) {
      ctx.res.statusCode = 404;
      return;
    }
    await ctx.db.api.saveCaptureModel(model);

    return ctx.redirect(ctx.routes.url('capture-model', { id: model.id }));
  } catch (err) {
    ctx.res.statusCode = 404;
  }
};

const fixtures: RouteMiddleware = async ctx => {
  ctx.headers['Content-Type'] = 'text/html';
  ctx.body = `
    <h1>Fixtures</h1>
    ${readdirSync(path.join(__dirname, '../../../fixtures'))
      .map(name =>
        name === 'simple.json'
          ? ''
          : `<h3>${name}</h3>
           <ul>
           ${readdirSync(path.join(__dirname, `../../../fixtures/${name}`))
             .map(
               file =>
                 `<li><a href="${ctx.routes.url('test-fixture', { name, file: file.slice(0, -5) })}">${file}</a></li>`
             )
             .join('')}
           </ul>`
      )
      .join('')}
  `;
};

export const router = new TypedRouter({
  'index-page': [TypedRouter.GET, '/', indexPage],
  'capture-model': [TypedRouter.GET, '/capture-model/:id', captureModelApi],
  'test-fixture': [TypedRouter.GET, '/test-fixture/:name/:file', testFixture],
  fixtures: [TypedRouter.GET, '/fixtures', fixtures],
});
