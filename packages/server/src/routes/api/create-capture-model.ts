import { CaptureModel } from '@capture-models/types';
import { RequestError } from '../../errors/RequestError';
import { RouteMiddleware } from '../../types';
import { userCan } from '../../utility/user-can';

export const createCaptureModelApi: RouteMiddleware<{}, CaptureModel> = async (context, next) => {
  if (!userCan('models.create', context.state)) {
    context.status = 404;
    return;
  }

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

  // @todo add creator to contributors.

  context.response.body = await context.db.api.saveCaptureModel(body, { context: context.state.jwt.context });
};
