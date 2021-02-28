import { RouteMiddleware } from '../../types';
import { userCan } from '../../utility/user-can';

export const searchPublished: RouteMiddleware = async (ctx, next) => {
  if (!userCan('models.view_published', ctx.state)) {
    ctx.status = 404;
    return;
  }

  const { q: query, manifest, canvas, collection, field_type, parent_property, selector_type, capture_model_id } =
    (ctx.request.query as any) || {};

  const queryBlock: any = {};

  if (manifest) {
    queryBlock.manifest = manifest;
  }
  if (canvas) {
    queryBlock.canvas = canvas;
  }
  if (collection) {
    queryBlock.collection = collection;
  }
  if (field_type) {
    queryBlock.field_type = field_type;
  }
  if (parent_property) {
    queryBlock.parent_property = parent_property;
  }
  if (selector_type) {
    queryBlock.selector_type = selector_type;
  }
  if (capture_model_id) {
    queryBlock.capture_model_id = capture_model_id;
  }

  ctx.response.body = {
    results: await ctx.db.api.searchPublishedFields(queryBlock, query, ctx.state.jwt.context),
  };

  await next();
};
