import 'reflect-metadata';
import { join } from 'path';
import { Connection, createConnection } from 'typeorm';
import { CaptureModelRepository } from './repository';

export type ConnectionOptions = {
  host: string;
  port: number;
  name: string;
  username: string;
  password: string;
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
      migrationsRun: true,
      ...config,
    }).catch(err => {
      throw err;
    });

    if (!connection.isConnected) {
      throw new Error();
    }

    return new CaptureModelDatabase(connection);
  }

  async synchronize(dropBeforeSync?: boolean) {
    console.log('Fixing bug with hanging models');
    try {
      // Document
      await this.connection.query(`
          delete
          from document d
          where d."captureModelId" is not null
            and not exists(select * from capture_model m where d."captureModelId" = m.id)
      `);
      // Property
      await this.connection.query(`
          delete
          from property p
          where p."documentId" is not null
            and not exists(select * from document d where d."id" = p."documentId")
      `);
      // Field
      await this.connection.query(`
          delete
          from field f
          where f."parentId" is not null
            and not exists(select * from document d where d."id"::text = f."parentId"::text)
      `);
      // Selector
      await this.connection.query(`
          delete
          from selector_instance s
          where s."revisionId" is not null
            and not exists(select * from revision r where r."id"::text = s."revisionId"::text)
      `);
      // Revision
      await this.connection.query(`
          delete
          from revision r
          where r."captureModelId" is not null
            and not exists(select * from capture_model m where m."id" = r."captureModelId")
      `);
      await this.connection.query(`
          delete
          from revision r
          where r."revisesId" is not null
            and not exists(select * from revision r2 where r2."id"::text = r."revisesId"::text)
      `);
      // Revision authors
      await this.connection.query(`
          delete
          from revision_authors r
          where r."revisionId" is not null
            and not exists(select * from revision r2 where r2."id"::text = r."revisionId"::text)
      `);
    } catch (e) {
      console.log('error', e);
      // ...
    }

    return await this.connection.synchronize(dropBeforeSync);
  }

  async runMigrations() {
    return await this.connection.runMigrations();
  }
}
