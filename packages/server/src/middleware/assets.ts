import { RouteMiddleware } from '../types';
import { readFileSync, existsSync } from 'fs';
import send from 'koa-send';

export const assets = (): RouteMiddleware<{ assetName: string; folder: string; subFolder?: string }> => {
  const manifest = require(`@capture-models/server-ui/dist/umd/manifest.json`);

  const assetList = Object.values(manifest);

  return async context => {
    const { assetName, folder, subFolder } = context.params;

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
      if (assetName === 'server-ui.js.map') {
        context.headers['Content-Type'] = 'application/javascript';
        context.body = readFileSync(
          require.resolve('@capture-models/server-ui/dist/umd/@capture-models/server-ui.js.map')
        );
        return;
      }
      const asset = context.request.path;
      const isValid =
        subFolder ||
        assetList.indexOf(asset) !== -1 ||
        (asset.endsWith('.map') && assetList.indexOf(asset.slice(0, -4)) !== -1);

      if (!isValid) {
        console.log(`Resource "${asset}" is not valid ${JSON.stringify(assetList)}`);
        context.status = 404;
        return;
      }

      const fileName = require.resolve(
        subFolder
          ? `@capture-models/server-ui/dist/umd/${subFolder}/${assetName}`
          : `@capture-models/server-ui/dist/umd/${assetName}`
      );
      if (existsSync(fileName)) {
        await send(context, fileName, { root: '/' });
        // context.body = Buffer.from(readFileSync(fileName));
        // context.headers['Content-Type'] = fileName.endsWith('.js') ? 'application/javascript' : 'text/css';
        return;
      }
    }
  };
};
