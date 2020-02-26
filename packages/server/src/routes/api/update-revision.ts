import { RevisionRequest } from '@capture-models/types';
import { RequestError } from '../../errors/RequestError';
import { RouteMiddleware } from '../../types';

export const updateRevisionApi: RouteMiddleware<{ id: string }, RevisionRequest> = async (context, next) => {
  const revisionRequest = context.requestBody;
  if (context.params.id !== revisionRequest.revision.id) {
    throw new RequestError('Revision cannot be saved to another revision');
  }

  context.response.body = await context.db.api.updateRevision(revisionRequest, { allowDeletedFields: true });
  context.status = 200;
};
