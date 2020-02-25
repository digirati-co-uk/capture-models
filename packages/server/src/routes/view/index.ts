import { RouteMiddleware } from '../../types';

export const indexPage: RouteMiddleware = async (ctx, next) => {
  ctx.header['Content-Type'] = 'text/html';
  ctx.body = `<h1>Hello world</h1>`;

  await next();
};
