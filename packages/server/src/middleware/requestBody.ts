import { Middleware } from 'koa';

export const requestBody: Middleware = async (context, next) => {
  const req: any = context.request;
  if (req.body) {
    context.requestBody = req.body;
  }
  await next();
};
