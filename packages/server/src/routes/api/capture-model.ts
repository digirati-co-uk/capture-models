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

  const query = ctx.query as {
    author: string;
    revisionId: string;
    revision_id: string;
    published: string;
  };

  const published = castBool(query.published, false);
  const onlyUser = canSeeFullModel ? query.author : userUrn;

  try {
    // Admins can bypass
    ctx.body = await ctx.db.api.getCaptureModel(ctx.params.id, {
      context: ctx.state.jwt.context,
      includeCanonical: !!published,
      revisionStatus: published ? 'accepted' : undefined,
      revisionId: query.revision_id || query.revisionId,
      userId: onlyUser,
      showAllRevisions: canSeeFullModel && !onlyUser && !published && !query.revision_id,
    });
  } catch (err) {
    console.log('Error while fetching model', err);
    ctx.status = 404;
    return;
  }

  await next();
};
