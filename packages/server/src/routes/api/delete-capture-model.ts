import { RouteMiddleware } from '../../types';
import { userCan } from '../../utility/user-can';

export const deleteCaptureModelApi: RouteMiddleware<{ id: string }> = async context => {
  if (!userCan('models.admin', context.state)) {
    context.status = 404;
    return;
  }

  if (!(await context.db.api.captureModelExists(context.params.id, context.state.jwt.context))) {
    context.status = 204;
    return;
  }

  await context.db.api.removeCaptureModel(context.params.id);
  context.status = 204;
};
