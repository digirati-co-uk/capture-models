import { Middleware } from 'koa';
import { NotFoundError } from '../errors/NotFoundError';
import { RequestError } from '../errors/RequestError';
import { ServerError } from '../errors/ServerError';

export const errorHandler: Middleware = async (context, next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof RequestError) {
      context.response.body = { error: err.message };
      context.status = 400;
    } else if (err instanceof ServerError) {
      context.response.status = 500;
    } else if (err instanceof NotFoundError) {
      if (err.message) {
        context.response.body = { error: err.message };
      }
      context.response.status = 404;
    } else {
      console.log('Unhandled error');
      console.log(err);
      context.response.status = 500;
    }
  }
};
