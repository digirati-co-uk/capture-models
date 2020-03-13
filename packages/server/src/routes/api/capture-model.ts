import { RouteMiddleware } from '../../types';
import { userCan } from '../../utility/user-can';

export const captureModelApi: RouteMiddleware<{ id: string }> = async (ctx, next) => {
  if (!userCan('models.view_published', ctx.state)) {
    ctx.status = 404;
    return;
  }

  try {
    // Admins can bypass
    if (ctx.query._all && userCan('models.admin', ctx.state)) {
      ctx.body = await ctx.db.api.getCaptureModel(ctx.params.id);
    } else {
      ctx.body = await ctx.db.api.getCaptureModel(ctx.params.id, {
        context: ctx.state.jwt.context,
      });
    }
  } catch (err) {
    console.log('Error while fetching model', err);
    ctx.status = 404;
    return;
  }

  await next();
};
