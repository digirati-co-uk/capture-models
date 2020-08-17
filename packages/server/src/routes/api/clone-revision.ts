import { RouteMiddleware } from '../../types';
import { userCan } from '../../utility/user-can';

export const cloneRevisionApi: RouteMiddleware<{ captureModelId: string; revisionId: string }> = async context => {
  if (!userCan('models.create', context.state)) {
    context.status = 404;
    return;
  }

  context.response.body = await context.db.api.cloneRevision(context.params.captureModelId, context.params.revisionId, {
    user: context.state.jwt.user,
    context: context.state.jwt.context,
  });
};
