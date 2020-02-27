import * as path from 'path';
import { RouteMiddleware } from '../types';
import { readFileSync, existsSync } from 'fs';

export const assets = (): RouteMiddleware<{ assetName: string; folder: string }> => {
  const manifest = require(`@capture-models/server-ui/dist/umd/manifest.json`);

  const assetList = Object.values(manifest);

  return context => {
    const { assetName, folder } = context.params;

    if (assetName.match(/\.\./)) {
      context.status = 404;
      return;
    }

    if (folder === 'umd') {
      if (assetName === 'viewer-ui.js') {
        context.headers['Content-Type'] = 'application/javascript';
        context.body = readFileSync(require.resolve('@capture-models/server-ui'));
        return;
      }

      if (assetList.indexOf(context.request.path) === -1) {
        context.status = 404;
        return;
      }

      const fileName = require.resolve(`@capture-models/server-ui/dist/umd/${assetName}`);
      console.log(`Resource: ${fileName}`);
      if (existsSync(fileName)) {
        context.headers['Content-Type'] = 'application/javascript';
        context.body = readFileSync(fileName);
        return;
      }
    }
  };
};
