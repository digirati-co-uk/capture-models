import { RouteMiddleware } from '../../types';

export const captureModelListApi: RouteMiddleware = async context => {
  context.response.body = await context.db.api.getAllCaptureModels(context.query.page, 20);
};
