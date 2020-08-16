import { RevisionRequest } from '@capture-models/types';
import { RequestError } from '../../errors/RequestError';
import { RouteMiddleware } from '../../types';
import { userCan } from '../../utility/user-can';

export const createRevisionApi: RouteMiddleware<{ captureModelId: string }, RevisionRequest> = async context => {
  if (!userCan('models.contribute', context.state)) {
    context.status = 404;
    return;
  }

  const revisionRequest = context.requestBody;
  const captureModelId = context.params.captureModelId;

  if (revisionRequest.captureModelId !== captureModelId) {
    throw new RequestError('Invalid capture model request');
  }

  if (await context.db.api.revisionExists(revisionRequest.revision.id)) {
    throw new RequestError('Revision already exists');
  }

  // Different types of revisions. @todo what to do in these cases.
  if (revisionRequest.revision.approved && !userCan('models.create', context.state)) {
    throw new Error('Auto approved');
  }
  if (revisionRequest.revision.source === 'canonical' && !userCan('models.create', context.state)) {
    throw new Error('Editing canonical');
  }

  context.response.body = await context.db.api.createRevision(revisionRequest, {
    allowAnonymous: true, // @todo swap in JWT user details.
    context: context.state.jwt.context,
    user: context.state.jwt.user,
  });
};
