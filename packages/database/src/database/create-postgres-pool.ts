import { createPool } from 'slonik';

type PoolConfig = {
  username: string;
  password: string;
  host: string;
  port: number | string;
  database: string;
};

export function createPostgresPool(config: PoolConfig) {
  return createPool(
    `postgres://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`
  );
}
