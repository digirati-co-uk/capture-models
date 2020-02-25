import { RouteMiddleware } from '../../types';

export const captureModelApi: RouteMiddleware<{ id: string }> = async (ctx, next) => {
  try {
    ctx.body = await ctx.db.api.getCaptureModel(ctx.params.id);
  } catch (err) {
    console.log('Error while fetching model', err);
    ctx.status = 404;
    return;
  }

  await next();
};
