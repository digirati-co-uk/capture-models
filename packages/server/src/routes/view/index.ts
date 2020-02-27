import { RouteMiddleware } from '../../types';

export const indexPage: RouteMiddleware = async (ctx, next) => {
  ctx.header['Content-Type'] = 'text/html';
  ctx.body = `
        <head>
            <link rel="stylesheet" href="${ctx.routes.url('assets', {
              assetName: 'app.css',
              folder: 'umd',
            })}" />
        </head>
        <div id="root"></div>
      
        <script type="application/javascript" src="${ctx.routes.url('assets', {
          assetName: 'viewer-ui.js',
          folder: 'umd',
        })}"></script>
  `;

  await next();
};
