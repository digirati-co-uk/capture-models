import { RouteMiddleware } from '../types';
import { readFileSync } from 'fs';

export const assets: RouteMiddleware = (context, next) => {
  context.headers['Content-Type'] = 'application/javascript';
  context.body = readFileSync(require.resolve('@capture-models/editor'));
};
