import { RouteMiddleware } from '../../types';

const base = process.env.BASE_PATH || '';

const appCss = {
  assetName: 'app.css',
  folder: 'umd',
};

const viewerUIJs = {
  assetName: 'viewer-ui.js',
  folder: 'umd',
};

export const indexPage: RouteMiddleware = async (ctx, next) => {
  ctx.header['Content-Type'] = 'text/html';
  ctx.body = `
    <head>
    <title>Crowdsourcing Editor</title>
      <link rel="stylesheet" href="${base}${ctx.routes.url('assets', appCss)}" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
    </head>
    <body>
      <div id="root"></div>
    
      <script type="application/javascript" src="${base}${ctx.routes.url('assets', viewerUIJs)}"></script>
    </body>
  `;

  await next();
};

export const redirectToIndexPage: RouteMiddleware = ctx => {
  return ctx.redirect(ctx.routes.url('index-page'));
};
