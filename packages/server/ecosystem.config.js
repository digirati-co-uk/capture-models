/* eslint-disable @typescript-eslint/camelcase */
module.exports = {
  apps: [
    {
      name: 'server-ui-dev',
      script: 'src/index.ts',

      // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
      args: 'one two',
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        DATABASE_HOST: 'localhost',
        DATABASE_NAME: 'postgres',
        DATABASE_PORT: 5432,
        DATABASE_USER: 'postgres',
        DATABASE_SCHEMA: 'public',
        DATABASE_PASSWORD: 'postgres',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'server-ui-madoc-local',
      script: 'src/index.ts',
      instances: 1,
      autorestart: true,
      watch: true,
      env: {
        NODE_ENV: 'development',
        DATABASE_HOST: 'localhost',
        DATABASE_NAME: 'model_api',
        DATABASE_PORT: 5400,
        DATABASE_USER: 'model_api',
        DATABASE_SCHEMA: 'public',
        DATABASE_PASSWORD: 'model_api_password',
        MOCK_JWT: true,
      },
    },
    {
      name: 'server-ui-prod',
      script: 'lib/index.js',
      // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
