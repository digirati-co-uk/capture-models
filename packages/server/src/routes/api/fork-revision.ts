import { RouteMiddleware } from '../../types';
import { userCan } from '../../utility/user-can';

export const forkRevisionApi: RouteMiddleware<{ captureModelId: string; revisionId: string }> = async context => {
  if (!userCan('models.contribute', context.state)) {
    context.status = 404;
    return;
  }

  const query = context.query as {
    clone_mode: string;
  };

  const cloneMode = userCan('models.create', context.state) ? query.clone_mode || 'FORK_TEMPLATE' : 'FORK_TEMPLATE';

  // @todo, params for cloneMode, modelMapping and other options.
  context.response.body = await context.db.api.forkRevision(context.params.captureModelId, context.params.revisionId, {
    modelRoot: [],
    cloneMode,
    includeRevisions: true,
    includeStructures: true,
    context: context.state.jwt.context,
  });
};
