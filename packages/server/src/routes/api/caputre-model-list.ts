import { RouteMiddleware } from '../../types';
import { userCan } from '../../utility/user-can';

export const captureModelListApi: RouteMiddleware = async context => {
  if (!userCan('models.view_published', context.state)) {
    context.status = 404;
    return;
  }

  const showAll = context.query._all && userCan('models.admin', context.state);

  context.response.body = await context.db.api.getAllCaptureModels(context.query.page, 20, {
    context: showAll ? undefined : context.state.jwt.context,
  });
};
