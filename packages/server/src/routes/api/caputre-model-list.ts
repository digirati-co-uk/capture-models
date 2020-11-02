import { RouteMiddleware } from '../../types';
import { userCan } from '../../utility/user-can';
import { castBool } from '../../utility/cast-bool';

export const captureModelListApi: RouteMiddleware = async context => {
  if (!userCan('models.view_published', context.state)) {
    context.status = 404;
    return;
  }

  const targetType = context.query.target_type;
  const targetId = context.query.target_id;
  const derivedFrom = context.query.derived_from;
  const includeDerivatives = castBool(context.query.all_derivatives);

  const showAll = context.query._all && userCan('models.admin', context.state);

  context.response.body = await context.db.api.getAllCaptureModels(context.query.page, 20, {
    context: showAll ? undefined : context.state.jwt.context,
    target: targetId && targetType ? { id: targetId, type: targetType } : undefined,
    derivedFrom,
    includeDerivatives,
  });
};
