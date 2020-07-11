import { PluginContext } from '../context';
import { ContentOptions, Target } from '@capture-models/types';
import React, { useContext } from 'react';

export function useContentType(target?: Target[], options: ContentOptions = {}) {
  const ctx = useContext(PluginContext);

  if (!target) {
    return null;
  }

  const keys = Object.keys(ctx.contentTypes);
  for (const key of keys) {
    const type = ctx.contentTypes[key];
    if (type && type.supports(target, options)) {
      return React.createElement(type.DefaultComponent, {
        state: type.targetToState(target, options),
        options,
      } as any);
    }
  }
  return null;
}
