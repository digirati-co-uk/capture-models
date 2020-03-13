import { createRevisionRequestFromStructure, findStructure } from '@capture-models/helpers';
import { RouteMiddleware } from '../../types';
import { userCan } from '../../utility/user-can';

export const choiceRevisionApi: RouteMiddleware<{ captureModelId: string; structureId: string }> = async context => {
  if (!userCan('models.contribute', context.state)) {
    context.status = 404;
    return;
  }

  const captureModel = await context.db.api.getCaptureModel(context.params.captureModelId, {
    context: context.state.jwt.context,
  });
  if (!captureModel) {
    context.status = 404;
    return;
  }
  const foundStructure = findStructure(captureModel, context.params.structureId);

  if (!foundStructure) {
    context.status = 404;
  }

  context.response.body = createRevisionRequestFromStructure(captureModel, foundStructure);
};
