import { RequestError } from '../../errors/RequestError';
import { RouteMiddleware } from '../../types';

export const deleteCaptureModelApi: RouteMiddleware<{ id: string }> = async context => {
  if (!(await context.db.api.captureModelExists(context.params.id))) {
    throw new RequestError('Capture model does not exist');
  }

  await context.db.api.removeCaptureModel(context.params.id);
  context.status = 204;
};
