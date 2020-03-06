import { RevisionRequest } from '@capture-models/types';
import { RequestError } from '../../errors/RequestError';
import { RouteMiddleware } from '../../types';

export const createRevisionApi: RouteMiddleware<{ captureModelId: string }, RevisionRequest> = async context => {
  const revisionRequest = context.requestBody;
  const captureModelId = context.params.captureModelId;

  if (revisionRequest.captureModelId !== captureModelId) {
    throw new RequestError('Invalid capture model request');
  }

  if (await context.db.api.revisionExists(revisionRequest.revision.id)) {
    throw new RequestError('Revision already exists');
  }

  // Different types of revisions. @todo what to do in these cases.
  if (revisionRequest.revision.approved) {
    throw new Error('Auto approved');
  }
  if (revisionRequest.revision.source === 'canonical') {
    throw new Error('Editing canonical');
  }

  context.response.body = await context.db.api.createRevision(revisionRequest, {
    allowAnonymous: true,
  });
};
