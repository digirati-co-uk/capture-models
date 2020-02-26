import { RouteMiddleware } from '../../types';

export const forkRevisionApi: RouteMiddleware<{ captureModelId: string; revisionId: string }> = async context => {
  // @todo, params for cloneMode, modelMapping and other options.
  context.response.body = await context.db.api.forkRevision(context.params.captureModelId, context.params.revisionId, {
    modelRoot: [],
    cloneMode: 'FORK_TEMPLATE',
    includeRevisions: true,
    includeStructures: true,
  });
};
