import { CaptureModelDatabase } from '@capture-models/database';
import { Middleware, RouterParamContext } from '@koa/router';
import * as Koa from 'koa';
import { router } from './router';

export interface ApplicationState {
  // User.
  // JWT.
  // Role.
  // etc...
  jwtToken: any;
}

export interface ApplicationContext {
  db: CaptureModelDatabase;
  routes: typeof router;
}

export type RouteMiddleware<Params = any> = Koa.Middleware<
  ApplicationState,
  ApplicationContext & Omit<RouterParamContext<ApplicationState, ApplicationContext>, 'params'> & { params: Params }
>;
