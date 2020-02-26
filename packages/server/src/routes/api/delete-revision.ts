import { RequestError } from '../../errors/RequestError';
import { RouteMiddleware } from '../../types';

export const deleteRevisionApi: RouteMiddleware<{ id: string }> = async context => {
  if (!(await context.db.api.revisionExists(context.params.id))) {
    throw new RequestError('Revision does not exist');
  }

  await context.db.api.removeRevision(context.params.id, {
    allowRemoveCanonical: true,
  });

  context.status = 204;
};
