import { RouteMiddleware } from '../../types';
import { userCan } from '../../utility/user-can';

export const searchPublished: RouteMiddleware = async (ctx, next) => {
  if (!userCan('models.view_published', ctx.state)) {
    ctx.status = 404;
    return;
  }

  const {
    q: query,
    manifest,
    canvas,
    collection,
    field_type: fieldType,
    parent_property: parentProperty,
    selector_type: selectorType,
  } = ctx.params.query;

  ctx.response.body = {
    results: await ctx.db.api.searchPublishedFields(
      {
        manifest,
        canvas,
        collection,
        fieldType,
        parentProperty,
        selectorType,
      },
      query,
      ctx.state.jwt.context
    ),
  };

  await next();
};
