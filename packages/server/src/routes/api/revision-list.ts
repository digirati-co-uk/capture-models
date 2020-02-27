import { RouteMiddleware } from '../../types';

export const revisionListApi: RouteMiddleware = async context => {
  context.body = await context.db.api.getAllRevisions();
};
