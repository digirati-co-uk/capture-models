import { RouteMiddleware } from '../../types';

export const forkRevisionApi: RouteMiddleware<{ captureModelId: string, revisionId: string }> = async (context) => {

  // @todo, params for cloneMode, modelMapping and other options.

};
