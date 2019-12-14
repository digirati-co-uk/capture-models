import { CaptureModel } from '../types/capture-model';
import {
  createChoice,
  createModel,
  documentFieldOptionsToStructure,
  getDocumentFields,
  mergeFlatKeys,
  setTopLevelStructure,
  structureToFlatStructureDefinition,
} from './structure-editor';
describe('structure editor', () => {
  const DEFAULT_MODEL: CaptureModel = {
    structure: { type: 'model', label: 'empty', fields: [] },
    document: {
      '@context': '@none',
      term: '@none',
      type: 'entity',
      properties: {},
    },
  };

  describe('setTopLevelStructure', () => {
    test('top level model', () => {
      const newModel = setTopLevelStructure(
        DEFAULT_MODEL,
        createModel({
          fields: ['a', 'b'],
          label: 'My Model',
          description: 'My Model Description',
        })
      );

      expect(newModel).toMatchInlineSnapshot(`
        Object {
          "document": Object {
            "@context": "@none",
            "properties": Object {},
            "term": "@none",
            "type": "entity",
          },
          "structure": Object {
            "description": "My Model Description",
            "fields": Array [
              "a",
              "b",
            ],
            "label": "My Model",
            "type": "model",
          },
        }
      `);
    });

    test('top level choice', () => {
      const newModel = setTopLevelStructure(
        DEFAULT_MODEL,
        createChoice({
          label: 'My Choice',
          description: 'My choice description',
          items: [
            createModel({
              fields: ['a', 'b'],
              label: 'Choice A',
            }),
            createModel({
              fields: ['a', 'b'],
              label: 'Choice B',
            }),
          ],
        })
      );

      expect(newModel).toMatchInlineSnapshot(`
        Object {
          "document": Object {
            "@context": "@none",
            "properties": Object {},
            "term": "@none",
            "type": "entity",
          },
          "structure": Object {
            "description": "My choice description",
            "items": Array [
              Object {
                "fields": Array [
                  "a",
                  "b",
                ],
                "label": "Choice A",
                "type": "model",
              },
              Object {
                "fields": Array [
                  "a",
                  "b",
                ],
                "label": "Choice B",
                "type": "model",
              },
            ],
            "label": "My Choice",
            "type": "choice",
          },
        }
      `);
    });
  });

  describe('mergeFlatKeys', () => {
    test('simple fields', () => {
      expect(mergeFlatKeys([['field1'], ['field2'], ['field3']])).toEqual(['field1', 'field2', 'field3']);
    });

    test('simple fields nested', () => {
      expect(
        mergeFlatKeys([
          ['field1', 'field1.1'],
          ['field1', 'field1.2'],
          ['field1', 'field1.3'],
          ['field2', 'field2.1'],
          ['field3'],
        ])
      ).toEqual([['field1', ['field1.1', 'field1.2', 'field1.3']], ['field2', ['field2.1']], 'field3']);
    });

    test('complex fields nested', () => {
      expect(
        mergeFlatKeys([
          ['field1', 'field1.1'],
          ['field1', 'field1.2'],
          ['field2', 'field2.1'],
          ['field1', 'field1.3'],
          ['field2', 'field2.2'],
          ['field2', 'field2.3'],
          ['field3'],
        ])
      ).toEqual([
        ['field1', ['field1.1', 'field1.2', 'field1.3']],
        ['field2', ['field2.1', 'field2.2', 'field2.3']],
        'field3',
      ]);
    });

    test('duplicate fields nested', () => {
      expect(
        mergeFlatKeys([
          ['field1', 'field1.1'],
          ['field1', 'field1.2'],
          ['field3'],
          ['field1', 'field1.1'],
          ['field1', 'field1.2'],
          ['field1', 'entity2', 'entity2.2', 'entity.2'],
          ['field3'],
          ['field1', 'field1.1'],
          ['field1', 'entity2', 'entity2.3', 'entity.2'],
          ['field1', 'field1.2'],
          ['field3'],
          ['field1', 'entity2', 'entity2.2', 'entity.3'],
          ['field1', 'entity2', 'entity2.2', 'entity.3'],
        ])
      ).toEqual([
        [
          'field1',
          ['field1.1', 'field1.2', ['entity2', [['entity2.2', ['entity.2', 'entity.3']], ['entity2.3', ['entity.2']]]]],
        ],
        'field3',
      ]);
    });
  });

  describe('getDocumentFields', () => {
    test('simple fields', () => {
      expect(
        getDocumentFields({
          '@context': '@none',
          term: '@none',
          type: 'entity',
          label: 'Person',
          properties: {
            firstName: [
              {
                type: 'text-box',
                term: 'firstName',
                label: 'First name',
                value: '',
              },
            ],
            lastName: [
              {
                type: 'text-box',
                term: 'lastName',
                label: 'Last name',
                value: '',
              },
            ],
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "fields": Array [
            Object {
              "key": Array [
                "firstName",
              ],
              "label": "First name",
              "type": "text-box",
            },
            Object {
              "key": Array [
                "lastName",
              ],
              "label": "Last name",
              "type": "text-box",
            },
          ],
          "key": Array [],
          "label": "Person",
          "type": "model",
        }
      `);
    });
  });

  describe('structureToFlatStructureDefinition', () => {
    test('simple', () => {
      const model: CaptureModel['document'] = {
        term: '@none',
        type: 'entity',
        properties: {
          field1: [{ type: 'text-box', label: 'field 1', term: 'field1', value: '' }],
          field2: [{ type: 'text-box', label: 'field 2', term: 'field2', value: '' }],
          field3: [{ type: 'text-box', label: 'field 3', term: 'field3', value: '' }],
        },
      };

      const def = structureToFlatStructureDefinition(model, ['field1']);
      expect(def).toEqual([{ key: ['field1'], label: 'field 1', type: 'text-box' }]);

      const def2 = structureToFlatStructureDefinition(model, ['field2', 'field3']);
      expect(def2).toEqual([
        { key: ['field2'], label: 'field 2', type: 'text-box' },
        { key: ['field3'], label: 'field 3', type: 'text-box' },
      ]);
    });

    test('nested', () => {
      const model: CaptureModel['document'] = {
        term: '@none',
        type: 'entity',
        properties: {
          field1: [{ type: 'text-box', label: 'field 1', term: 'field1', value: '' }],
          entity1: [
            {
              type: 'entity',
              label: 'field 2',
              term: 'field2',
              properties: {
                field2: [
                  {
                    type: 'text-box',
                    label: 'field 2',
                    term: 'field2',
                    value: '',
                  },
                ],
                field3: [
                  {
                    type: 'text-box',
                    label: 'field 3',
                    term: 'field3',
                    value: '',
                  },
                ],
                field4: [
                  {
                    type: 'text-box',
                    label: 'field 4',
                    term: 'field4',
                    value: '',
                  },
                ],
              },
            },
          ],
        },
      };

      const def = structureToFlatStructureDefinition(model, [['entity1', ['field2', 'field4']]]);

      expect(def).toEqual([
        {
          key: ['entity1', 'field2'],
          label: 'field 2',
          type: 'text-box',
        },
        {
          key: ['entity1', 'field4'],
          label: 'field 4',
          type: 'text-box',
        },
      ]);

      expect(documentFieldOptionsToStructure(def)).toEqual([['entity1', ['field2', 'field4']]]);
    });
  });
});
