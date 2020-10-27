import { RouteMiddleware } from '../../types';
import { userCan } from '../../utility/user-can';
import { castBool } from '../../utility/cast-bool';

export const captureModelApi: RouteMiddleware<{ id: string }> = async (ctx, next) => {
  if (!userCan('models.view_published', ctx.state)) {
    ctx.status = 404;
    return;
  }

  const userUrn = ctx.state.jwt.user.id;

  const canSeeFullModel = userCan('models.create', ctx.state);

  const { author, revisionId } = ctx.query;
  const published = castBool(ctx.query.published, true);
  // Remove this option for now.
  // const showAll = castBool(ctx.query._all, false);
  const onlyUser = canSeeFullModel ? author : userUrn;

  // - Only published
  // - Published + their own revisions (models.contribute)
  // - All revisions (status = submitted + published)

  // Tested
  // - onlyUser is working!

  try {
    // Admins can bypass
    ctx.body = await ctx.db.api.getCaptureModel(ctx.params.id, {
      context: ctx.state.jwt.context,
      includeCanonical: !!published,
      revisionId,
      userId: onlyUser,
    });
  } catch (err) {
    console.log('Error while fetching model', err);
    ctx.status = 404;
    return;
  }

  await next();
};
