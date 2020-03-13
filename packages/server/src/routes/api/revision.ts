import { RouteMiddleware } from '../../types';
import { userCan } from '../../utility/user-can';

export const revisionApi: RouteMiddleware<{ id: string }> = async (context, next) => {
  if (!userCan('models.contribute', context.state)) {
    context.status = 404;
    return;
  }

  context.response.body = await context.db.api.getRevision(context.params.id, context.state.jwt.context);
  await next();
};
