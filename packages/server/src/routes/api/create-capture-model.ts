import { CaptureModel } from '@capture-models/types';
import { RequestError } from '../../errors/RequestError';
import { RouteMiddleware } from '../../types';

export const createCaptureModelApi: RouteMiddleware<{}, CaptureModel> = async (context, next) => {
  const body = context.requestBody;

  if (!body.id) {
    throw new RequestError(`Capture model requires ID to save`);
  }
  // @todo filter this based on JWT.
  // Role - admin
  // Site - [...]
  if (await context.db.api.captureModelExists(body.id)) {
    throw new RequestError('Revision already exists');
  }

  context.response.body = await context.db.api.saveCaptureModel(body);
};
