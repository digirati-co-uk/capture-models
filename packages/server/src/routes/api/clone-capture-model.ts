import { Target } from '@capture-models/types';
import { RouteMiddleware } from '../../types';
import { userCan } from '../../utility/user-can';

export const cloneCaptureModel: RouteMiddleware<{ id: string }, { target: Target[] }> = async context => {
  if (!userCan('models.create', context.state)) {
    context.status = 404;
    return;
  }

  // @todo validation of target body using schema.
  // This will take a capture model and return a new one with completely new fields.
  // It will only share the structure ID.
  context.response.body = await context.db.api.forkCaptureModel(
    context.params.id,
    context.requestBody.target,
    { id: context.state.jwt.user.id, name: context.state.jwt.user.name, type: 'Person' },
    context.state.jwt.context
  );
};
