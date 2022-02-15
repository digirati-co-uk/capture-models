import Router from '@koa/router';
import koaBody from 'koa-body';
import { requestBody } from '../middleware/requestBody';

import { RouteMiddleware } from '../types';

export type RouteWithParams<Props, Body = any> = [string, string, RouteMiddleware<Props, Body>];

export type GetRoute<
  Routes extends { [key in RouteName]: Value },
  RouteName extends string,
  Value = any
> = Routes[RouteName] extends RouteWithParams<infer T> ? T : never;

export type GetBody<
  Routes extends { [key in RouteName]: Value },
  RouteName extends string,
  Value = any
> = Routes[RouteName] extends RouteWithParams<any, infer T> ? T : never;

export class TypedRouter<
  Routes extends string,
  MappedRoutes extends { [key in Routes]: RouteWithParams<GetRoute<MappedRoutes, Routes>> }
> {
  static GET = 'get';
  static POST = 'post';
  static PUT = 'put';
  static DELETE = 'delete';

  private router: any = new Router();

  constructor(routes: MappedRoutes) {
    const routeNames = Object.keys(routes);
    for (const route of routeNames) {
      const [method, path, func] = routes[route];

      switch (method) {
        case TypedRouter.PUT:
        case TypedRouter.POST:
          this.router[method](route, path, koaBody(), requestBody, func);
          break;
        case TypedRouter.GET:
        case TypedRouter.DELETE:
          this.router[method](route, path, func);
          break;
      }
    }
  }

  url<Route extends Routes>(
    name: Route,
    params?: GetRoute<MappedRoutes, Route>,
    options?: Router.UrlOptionsQuery
  ): string {
    return this.router.url(name, params, options);
  }

  routes() {
    return this.router.routes();
  }

  allowedMethods() {
    return this.router.allowedMethods();
  }
}
