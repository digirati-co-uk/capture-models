import { RouteMiddleware } from '../../types';
import { userCan } from '../../utility/user-can';
import { castBool } from '../../utility/cast-bool';

export const revisionApi: RouteMiddleware<{ id: string }> = async (context, next) => {
  if (!userCan('models.contribute', context.state)) {
    context.status = 404;
    return;
  }

  const showRevised = castBool(context.query.show_revised as string);

  try {
    context.response.body = await context.db.api.getRevision(context.params.id, context.state.jwt.context, showRevised);
    await next();
  } catch (err) {
    context.status = 404;
    return;
  }
};
