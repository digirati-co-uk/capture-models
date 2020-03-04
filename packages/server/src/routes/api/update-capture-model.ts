import { RouteMiddleware } from '../../types';
import { CaptureModel } from '@capture-models/types';

export const updateCaptureModelApi: RouteMiddleware<{ id: string }, CaptureModel> = async ctx => {
  ctx.response.body = await ctx.db.api.saveCaptureModel(ctx.requestBody);
};
