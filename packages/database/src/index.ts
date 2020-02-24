import 'reflect-metadata';
import { join } from 'path';
import { createConnection } from 'typeorm';
import { CaptureModelRepository } from './repository';

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
  entities: [join(__dirname, 'entity/**/*.js'), join(__dirname, 'entity/**/*.ts')],
  migrations: [join(__dirname, 'migration/**/*.js'), join(__dirname, 'migration/**/*.ts')],
  subscribers: [join(__dirname, 'subscriber/**/*.js'), join(__dirname, 'subscriber/**/*.ts')],
  cli: {
    entitiesDir: join(__dirname, 'entity'),
    migrationsDir: join(__dirname, 'migration'),
    subscribersDir: join(__dirname, 'subscriber'),
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

    //
    // const fullModel = fromCaptureModel({
    //   structure: {
    //     id: 'b523c02a-d2f4-4b7b-70c5-d59e3f23e251',
    //     type: 'choice',
    //     label: 'Basic - Single field',
    //     description: 'Contains single choice with single text field',
    //     items: [
    //       {
    //         id: 'b523c02a-d2f4-4b7b-70c5-d59e3f23e252',
    //         type: 'model',
    //         label: 'Metadata',
    //         fields: ['label'],
    //       },
    //     ],
    //   },
    //   target: [
    //     { type: 'manifest', id: 'https://view.nls.uk/manifest/7446/74464117/manifest.json' },
    //     { type: 'canvas', id: 'https://view.nls.uk/iiif/7446/74464117/canvas/3' },
    //   ],
    //   document: {
    //     id: 'b523c02a-d2f4-4b7b-70c5-d59e3f23e652',
    //     type: 'entity',
    //     label: 'Label',
    //     labelledBy: 'label',
    //     properties: {
    //       label: [
    //         {
    //           id: 'b523c02a-d2f4-4b7b-70c5-d58e3f23e652',
    //           type: 'text-field',
    //           label: 'Name',
    //           value: 'Forth Road Bridge',
    //         },
    //       ],
    //     },
    //   },
    // });
    //
    // // @ts-ignore
    // // console.log(fullModel);
    //
    // await connection.manager.save(fullModel);
    //

    await connection.synchronize(true);

    const repo = connection.getCustomRepository(CaptureModelRepository);

    const modelFromType = require('../../../fixtures/03-revisions/06-model-root.json');

    const model = await repo.saveCaptureModel(modelFromType);

    if (!model.id) {
      throw new Error();
    }

    const newModel = await repo.getCaptureModel(model.id);

    console.log(JSON.stringify(newModel, null, 4));

    console.log(await repo.removeCaptureModel(newModel.id, 1));

    process.exit();

    // console.log(model);
    // console.log(newModel);

    // process.exit();
    //
    // const exampleDoc = fromDocument({
    //   id: 'b623c02a-d2f4-4b7b-70c5-d59e3f23e259',
    //   type: 'entity',
    //   label: 'Label',
    //   labelledBy: 'label',
    //   properties: {
    //     label: [
    //       {
    //         id: 'b623c02a-d2f4-4b7b-70c5-d59e3f23e258',
    //         type: 'text-field',
    //         label: 'Name',
    //         value: 'Forth Road Bridge',
    //       },
    //     ],
    //   },
    // });
    //
    // console.log(exampleDoc);
    //
    // await connection.manager.save(exampleDoc);
    //
    // const dbDoc = await connection.manager.findOne(Document, { id: 'b623c02a-d2f4-4b7b-70c5-d59e3f23e259' });
    //
    // console.log(dbDoc);
    // console.log(JSON.stringify(await toDocument(dbDoc), null, 2));
    // process.exit();
    //
    // const toSave = fromStructure({
    //   id: 'b623c02a-d2f4-4b7b-90c5-d59e3f23e259',
    //   type: 'choice',
    //   label: 'Deeply nested subset, edited',
    //   items: [
    //     {
    //       id: 'b623c02a-d2f4-4b7b-90c5-d59e3f23e258',
    //       label: 'Edit all names',
    //       type: 'model',
    //       fields: [['depth1', [['second', [['third', ['name']]]]]]],
    //     },
    //     {
    //       id: 'b623c02a-d2f4-4b7b-90c5-d59e3f23e257',
    //       label: 'Edit all descriptions',
    //       type: 'model',
    //       fields: [['depth1', [['second', [['third', ['description']]]]]]],
    //     },
    //   ],
    //   description: 'A document with a nested structure, but only editing a single field deep in the tree.',
    // });
    //
    // // await connection.manager.save(toSave);
    // // const structures = await connection.manager.find(Structure);
    //
    // console.log('starting...');
    // const single = await connection.manager.findOne(Structure, { id: 'b623c02a-d2f4-4b7b-90c5-d59e3f23e259' });
    // console.log(single);
    // const stuct = await toStructure(single);
    // console.log(stuct);
    //
    // console.log(JSON.stringify(stuct, null, 2));
    //
    // process.exit();

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
  .catch(error => {
    console.log(error);
    process.exit(1);
  });
