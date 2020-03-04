import { RouteMiddleware } from '../../types';

export const forkCaptureModel: RouteMiddleware<{ id: string }> = context => {
  // This will take a capture model and return a new one with completely new fields.
  // It will only share the structure ID.
  context.response.body = { error: 'not yet implemented' };
};
