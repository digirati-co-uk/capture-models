import { RouteMiddleware } from '../../types';
import { userCan } from '../../utility/user-can';

export const revisionListApi: RouteMiddleware = async context => {
  if (!userCan('models.admin', context.state)) {
    context.status = 404;
    return;
  }

  context.body = await context.db.api.getAllRevisions();
};
