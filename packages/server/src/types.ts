import { CaptureModelDatabase } from '@capture-models/database';
import { Contributor } from '@capture-models/types';
import { RouterParamContext } from '@koa/router';
import * as Koa from 'koa';
import { router } from './router';

export type JWTScopes =
  | 'models.admin'
  | 'models.revision'
  | 'models.create'
  | 'models.contribute'
  | 'models.view_published';

export interface ApplicationState {
  jwt: {
    context: string[];
    scope: JWTScopes[];
    user: Contributor & { name: string };
  };
}

export interface ApplicationContext {
  db: CaptureModelDatabase;
  routes: typeof router;
}

export type RouteMiddleware<Params = any, Body = any> = Koa.Middleware<
  ApplicationState,
  ApplicationContext &
    Omit<RouterParamContext<ApplicationState, ApplicationContext>, 'params'> & { params: Params } & {
      requestBody: Body;
    }
>;
