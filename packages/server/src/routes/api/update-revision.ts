import { RevisionRequest } from '@capture-models/types';
import { RequestError } from '../../errors/RequestError';
import { RouteMiddleware } from '../../types';
import { userCan } from '../../utility/user-can';

export const updateRevisionApi: RouteMiddleware<{ id: string }, RevisionRequest> = async (context, next) => {
  if (!userCan('models.contribute', context.state)) {
    context.status = 404;
    return;
  }

  const revisionRequest = context.requestBody;
  if (context.params.id !== revisionRequest.revision.id) {
    throw new RequestError('Revision cannot be saved to another revision');
  }

  context.response.body = await context.db.api.updateRevision(revisionRequest, {
    context: context.state.jwt.context,
    allowDeletedFields: true,
    user: context.state.jwt.user,
    // allowUserMismatch: userCan('models.admin', context.state),
  });
  context.status = 200;
};
