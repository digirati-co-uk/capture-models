import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Document } from './entity/Document';
import { Structure } from './entity/Structure';
import { fromCaptureModel } from './mapping/from-capture-model';
import { fromDocument } from './mapping/from-document';
import { fromStructure } from './mapping/from-structure';
import { toCaptureModel } from './mapping/to-capture-model';
import { toDocument } from './mapping/to-document';
import { toStructure } from './mapping/to-structure';
import { CaptureModelRepository } from './repository';
import { CaptureModel } from '@capture-models/types';
import { v4 } from 'uuid';

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

    const revisions = [v4(), v4(), v4()];
    const s2 = v4();

    const modelFromType: CaptureModel = {
      structure: {
        id: v4(),
        type: 'choice',
        label: 'Revisions - multiple transcriptions',
        items: [
          {
            id: s2,
            label: 'Transcriptions',
            type: 'model',
            fields: ['transcription'],
          },
        ],
        description: '',
      },
      document: {
        id: v4(),
        type: 'entity',
        label: 'Name of entity',
        properties: {
          transcription: [
            {
              id: v4(),
              type: 'text-field',
              label: 'Transcription',
              allowMultiple: true,
              value: 'Canonical transcription, maybe OCR',
            },
            {
              id: v4(),
              type: 'text-field',
              label: 'Transcription',
              allowMultiple: true,
              revision: revisions[0],
              value: 'Person A created this one',
            },
            {
              id: v4(),
              type: 'text-field',
              label: 'Transcription',
              allowMultiple: true,
              revision: revisions[1],
              value: "Person B created this one, to override Person A's one",
            },
            {
              id: v4(),
              type: 'text-field',
              label: 'Transcription',
              allowMultiple: true,
              revision: revisions[2],
              value: 'Person C created this one',
            },
          ],
        },
      },
      contributors: {
        [revisions[0]]: {
          id: revisions[0],
          type: 'Person',
          name: 'Test person A',
        },
        [revisions[1]]: {
          id: revisions[1],
          type: 'Person',
          name: 'Test person B',
        },
        [revisions[2]]: {
          id: revisions[2],
          type: 'Person',
          name: 'Test person C',
        },
      },
      revisions: [
        {
          id: revisions[0],
          approved: true,
          structureId: s2,
          fields: ['transcription'],
          authors: [revisions[0]],
        },
        {
          id: revisions[1],
          revises: revisions[0],
          structureId: s2,
          fields: ['transcription'],
          authors: [revisions[1]],
        },
        {
          id: revisions[2],
          structureId: s2,
          fields: ['transcription'],
          authors: [revisions[2]],
        },
      ],
    };

    const model = await repo.saveCaptureModel(modelFromType);

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
