import { createRevisionRequestFromStructure, findStructure } from '@capture-models/helpers';
import { RouteMiddleware } from '../../types';

export const choiceRevisionApi: RouteMiddleware<{ captureModelId: string; structureId: string }> = async context => {
  const captureModel = await context.db.api.getCaptureModel(context.params.captureModelId);
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
