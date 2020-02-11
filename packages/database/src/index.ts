import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Structure } from './entity/Structure';
// @ts-ignore
import config from '../ormconfig.json';

createConnection({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  name: 'default',
  username: 'postgres',
  database: 'postgres',
  schema: 'public',
  synchronize: true,
  logging: false,
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
})
  .then(async connection => {
    const structure = new Structure();
    structure.label = 'Test first structure';
    structure.description = 'Description';
    structure.profile = [];
    structure.items = [];

    const nestedStructure = new Structure();
    nestedStructure.label = 'Test first structure';
    nestedStructure.description = 'Description';

    structure.items.push(nestedStructure);

    await connection.manager.save(structure);

    console.log('Saved a new structure with id: ' + structure.id);
    const structures = await connection.manager.find(Structure);

    console.log(structures);

    process.exit();

    // console.log('Inserting a new user into the database...');
    // const user = new User();
    // user.firstName = 'Timber';
    // user.lastName = 'Saw';
    // user.age = 25;
    // await connection.manager.save(user);
    // console.log('Saved a new user with id: ' + user.id);
    //
    // console.log('Loading users from the database...');
    // const users = await connection.manager.find(User);
    // console.log('Loaded users: ', users);
    //
    // console.log('Here you can setup and run express/koa/any other framework.');
  })
  .catch(error => console.log(error));
