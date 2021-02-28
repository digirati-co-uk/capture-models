import { RouteMiddleware } from '../../types';
import { userCan } from '../../utility/user-can';
import { castBool } from '../../utility/cast-bool';

export const captureModelListApi: RouteMiddleware = async context => {
  if (!userCan('models.view_published', context.state)) {
    context.status = 404;
    return;
  }

  const query = context.query as {
    target_type: string;
    target_id: string;
    derived_from: string;
    all_derivatives: string;
    page: string;
  };

  const targetType = query.target_type;
  const targetId = query.target_id;
  const derivedFrom = query.derived_from;
  const includeDerivatives = castBool(query.all_derivatives);
  const page = query.page ? Number(query.page) : 1;

  const showAll = context.query._all && userCan('models.admin', context.state);

  context.response.body = await context.db.api.getAllCaptureModels(page, 20, {
    context: showAll ? undefined : context.state.jwt.context,
    target: targetId && targetType ? { id: targetId, type: targetType } : undefined,
    derivedFrom,
    includeDerivatives,
  });
};
