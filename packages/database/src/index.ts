import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Structure } from './entity/Structure';
import { fromStructure } from './mapping/from-structure';
import { toStructure } from './mapping/to-structure';

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
    // const structure = new Structure();
    // structure.label = 'Test first structure';
    // structure.description = 'Description';
    // structure.profile = [];
    // structure.items = [];
    //
    // const nestedStructure = new Structure();
    // nestedStructure.label = 'Test first structure';
    // nestedStructure.description = 'Description';
    //
    // structure.items.push(nestedStructure);
    //
    // await connection.manager.save(structure);
    //
    // console.log('Saved a new structure with id: ' + structure.id);
    // const structures = await connection.manager.find(Structure);
    // const trees = await connection.manager.getTreeRepository(Structure).findTrees();
    //
    //
    // console.log(trees);

    const toSave = fromStructure({
      id: 'b623c02a-d2f4-4b7b-90c5-d59e3f23e259',
      type: 'choice',
      label: 'Deeply nested subset, edited',
      items: [
        {
          id: 'b623c02a-d2f4-4b7b-90c5-d59e3f23e258',
          label: 'Edit all names',
          type: 'model',
          fields: [['depth1', [['second', [['third', ['name']]]]]]],
        },
        {
          id: 'b623c02a-d2f4-4b7b-90c5-d59e3f23e257',
          label: 'Edit all descriptions',
          type: 'model',
          fields: [['depth1', [['second', [['third', ['description']]]]]]],
        },
      ],
      description: 'A document with a nested structure, but only editing a single field deep in the tree.',
    });

    // await connection.manager.save(toSave);
    // const structures = await connection.manager.find(Structure);

    console.log('starting...');
    const single = await connection.manager.findOne(Structure, { id: 'b623c02a-d2f4-4b7b-90c5-d59e3f23e259' });
    console.log(single);
    const stuct = await toStructure(single);
    console.log(stuct);
    console.log(JSON.stringify(stuct, null, 2));

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
