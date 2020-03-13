import { RouteMiddleware } from '../../types';
import { CaptureModel } from '@capture-models/types';
import { userCan } from '../../utility/user-can';

export const updateCaptureModelApi: RouteMiddleware<{ id: string }, CaptureModel> = async ctx => {
  if (!userCan('models.create', ctx.state)) {
    ctx.status = 404;
    return;
  }

  ctx.response.body = await ctx.db.api.saveCaptureModel(ctx.requestBody, { context: ctx.state.jwt.context });
};
