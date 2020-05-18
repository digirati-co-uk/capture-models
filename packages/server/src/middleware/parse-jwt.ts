import { RequestError } from '../errors/RequestError';
import { RouteMiddleware } from '../types';
import { getToken } from '../utility/get-token';
import { parseToken } from '../utility/parse-token';

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

const MOCK_JWT = Boolean(process.env.MOCK_JWT || false) && process.env.NODE_ENV !== 'production';

export const parseJwt: RouteMiddleware = async (context, next) => {
  if (context.request.path.startsWith('/crowdsourcing-editor/')) {
    return next();
  }

  if (MOCK_JWT) {
    context.state.jwt = {
      mock: true,
      context: ['urn:madoc:1'],
      scope: ['models.admin', 'models.revision', 'models.create', 'models.contribute', 'models.view_published'],
      user: {
        id: 'http://example.org/users/0',
        type: 'Person',
        name: 'Test Admin User',
      },
    };

    await next();

    return;
  }

  const asUser =
    context.request.headers['x-madoc-site-id'] || context.request.headers['x-madoc-user-id']
      ? {
          userId: context.request.headers['x-madoc-site-id']
            ? Number(context.request.headers['x-madoc-site-id'])
            : undefined,
          siteId: context.request.headers['x-madoc-user-id']
            ? Number(context.request.headers['x-madoc-user-id'])
            : undefined,
        }
      : undefined;
  const token = getToken(context);

  if (!token) {
    throw new RequestError('Token not found');
  }

  const parsed = parseToken(token, asUser);

  if (!parsed) {
    throw new RequestError('Invalid token');
  }

  context.state.jwt = parsed;

  await next();
};
