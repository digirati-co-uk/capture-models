import 'reflect-metadata';
import { join } from 'path';
import { Connection, createConnection } from 'typeorm';
import { CaptureModelRepository } from './repository';

export type ConnectionOptions = {
  host: string;
  port: number;
  name: string;
  username: string;
  database: string;
  schema: string;
  logging?: boolean;
  synchronize?: boolean;
  migrations?: (Function | string)[];
  subscribers?: (Function | string)[];
  cli?: {
    migrations?: (Function | string)[];
    subscribers?: (Function | string)[];
  };
};

export class CaptureModelDatabase {
  connection: Connection;
  api: CaptureModelRepository;

  constructor(connection: Connection) {
    this.connection = connection;
    this.api = connection.getCustomRepository(CaptureModelRepository);
  }

  async drop() {
    await this.connection.dropDatabase();
  }

  static async create({ cli, ...config }: ConnectionOptions): Promise<CaptureModelDatabase> {
    const connection = await createConnection({
      type: 'postgres',
      synchronize: false,
      logging: false,
      entities: [join(__dirname, 'entity/**/*.js'), join(__dirname, 'entity/**/*.ts')],
      migrations: [join(__dirname, 'migration/**/*.js'), join(__dirname, 'migration/**/*.ts')],
      subscribers: [join(__dirname, 'subscriber/**/*.js'), join(__dirname, 'subscriber/**/*.ts')],
      cli: {
        entitiesDir: join(__dirname, 'entity'),
        migrationsDir: join(__dirname, 'migration'),
        subscribersDir: join(__dirname, 'subscriber'),
        ...(cli || {}),
      },
      ...config,
    });

    return new CaptureModelDatabase(connection);
  }

  async synchronize(dropBeforeSync?: boolean) {
    return await this.connection.synchronize(dropBeforeSync);
  }
}
