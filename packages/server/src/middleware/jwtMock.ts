import { Middleware } from 'koa';

/**
 * User scopes:
 * - models.admin
 * - models.revision
 * - models.create
 * - models.contribute
 * - models.view_published
 *
 * Context:
 * - At the moment just Madoc.
 * - Will filter out results as additional check (like tasks)
 * - Will _not_ be the association of crowd-sourced tasks.
 * - May need way to change context of item (if admin created) to a site.
 */
export const jwtMock: Middleware = async (context, next) => {
  context.state.jwt = {
    context: ['urn:madoc:1'],
    scope: ['models.admin', 'models.revision', 'models.create', 'models.contribute', 'models.view_published'],
    user: {
      id: 'http://example.org/users/0',
      type: 'Person',
      name: 'Test Admin User',
    },
  };

  await next();
};
