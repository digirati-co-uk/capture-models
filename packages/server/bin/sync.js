const { CaptureModelDatabase } = require('@capture-models/database');
const nodemonConfig = require('../nodemon');

async function main() {
  const db = await CaptureModelDatabase.create({
    host: nodemonConfig.env.DATABASE_HOST,
    port: nodemonConfig.env.DATABASE_PORT ? +nodemonConfig.env.DATABASE_PORT : 5432,
    name: 'default',
    username: nodemonConfig.env.DATABASE_USER,
    password: nodemonConfig.env.DATABASE_PASSWORD,
    database: nodemonConfig.env.DATABASE_NAME,
    schema: nodemonConfig.env.DATABASE_SCHEMA ? nodemonConfig.env.DATABASE_SCHEMA : 'public',
    synchronize: nodemonConfig.env.NODE_ENV === 'development',
  });
  await db.synchronize(true);
}

main().catch(err => {
  throw err;
});
