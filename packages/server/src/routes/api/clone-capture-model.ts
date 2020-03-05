import { Target } from '@capture-models/types';
import { RouteMiddleware } from '../../types';

export const cloneCaptureModel: RouteMiddleware<{ id: string }, { target: Target[] }> = async context => {
  // @todo validation of target body using schema.
  // This will take a capture model and return a new one with completely new fields.
  // It will only share the structure ID.
  context.response.body = await context.db.api.forkCaptureModel(context.params.id, context.requestBody.target);
};
