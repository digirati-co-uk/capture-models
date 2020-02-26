import { RouteMiddleware } from '../../types';

export const revisionApi: RouteMiddleware<{ id: string }> = async (context, next) => {
  context.response.body = await context.db.api.getRevision(context.params.id);
  await next();
};
