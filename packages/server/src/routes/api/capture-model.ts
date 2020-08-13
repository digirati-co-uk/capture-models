import { RouteMiddleware } from '../../types';
import { userCan } from '../../utility/user-can';

export const captureModelApi: RouteMiddleware<{ id: string }> = async (ctx, next) => {
  if (!userCan('models.view_published', ctx.state)) {
    ctx.status = 404;
    return;
  }

  const isAdmin = userCan('models.admin', ctx.state);

  const { published, author } = ctx.query;

  const onlyUser = isAdmin ? author : undefined;

  try {
    // Admins can bypass
    if (ctx.query._all && isAdmin) {
      ctx.body = await ctx.db.api.getCaptureModel(ctx.params.id, {
        includeCanonical: !!published,
        userId: onlyUser,
      });
    } else {
      ctx.body = await ctx.db.api.getCaptureModel(ctx.params.id, {
        context: ctx.state.jwt.context,
        includeCanonical: !!published,
        userId: onlyUser,
      });
    }
  } catch (err) {
    console.log('Error while fetching model', err);
    ctx.status = 404;
    return;
  }

  await next();
};
