import { Contributor } from '@capture-models/types';

export type JWTScopes =
  | 'models.admin'
  | 'models.revision'
  | 'models.create'
  | 'models.contribute'
  | 'models.view_published';

export type MockJwt = {
  context: string[];
  scope: JWTScopes[];
  user: Contributor & { name: string };
};

export async function getJWTMock(): Promise<MockJwt> {
  return {
    context: ['urn:madoc:1'],
    scope: ['models.admin', 'models.revision', 'models.create', 'models.contribute', 'models.view_published'],
    user: {
      id: 'http://example.org/users/0',
      type: 'Person',
      name: 'Test Admin User',
    },
  };
}
