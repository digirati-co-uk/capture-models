/* eslint-disable @typescript-eslint/camelcase */
module.exports = {
  apps: [
    {
      name: 'server-ui',
      script: 'src/index.ts',

      // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
      args: 'one two',
      instances: 1,
      autorestart: true,
      watch: false,
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
  ],
};