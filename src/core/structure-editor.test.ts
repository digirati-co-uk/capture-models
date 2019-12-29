import { CaptureModel } from '../types/capture-model';
import {
  documentFieldOptionsToStructure,
  expandModelFields,
  getDocumentFields,
  mergeFlatKeys,
  structureToFlatStructureDefinition,
} from './structure-editor';
describe('structure editor', () => {
  const DEFAULT_MODEL: CaptureModel = {
    structure: { type: 'model', label: 'empty', fields: [] },
    document: {
      type: 'entity',
      properties: {},
    },
  };

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
          [
            'field1.1',
            'field1.2',
            [
              'entity2',
              [
                ['entity2.2', ['entity.2', 'entity.3']],
                ['entity2.3', ['entity.2']],
              ],
            ],
          ],
        ],
        'field3',
      ]);
    });
  });

  describe('getDocumentFields', () => {
    test('simple fields', () => {
      expect(
        getDocumentFields({
          type: 'entity',
          label: 'Person',
          properties: {
            firstName: [
              {
                type: 'text-field',
                label: 'First name',
                value: '',
              },
            ],
            lastName: [
              {
                type: 'text-field',
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
              "type": "text-field",
            },
            Object {
              "key": Array [
                "lastName",
              ],
              "label": "Last name",
              "type": "text-field",
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
        type: 'entity',
        properties: {
          field1: [{ type: 'text-field', label: 'field 1', value: '' }],
          field2: [{ type: 'text-field', label: 'field 2', value: '' }],
          field3: [{ type: 'text-field', label: 'field 3', value: '' }],
        },
      };

      const def = structureToFlatStructureDefinition(model, ['field1']);
      expect(def).toEqual([{ key: ['field1'], label: 'field 1', type: 'text-field' }]);

      const def2 = structureToFlatStructureDefinition(model, ['field2', 'field3']);
      expect(def2).toEqual([
        { key: ['field2'], label: 'field 2', type: 'text-field' },
        { key: ['field3'], label: 'field 3', type: 'text-field' },
      ]);
    });

    test('nested', () => {
      const model: CaptureModel['document'] = {
        type: 'entity',
        properties: {
          field1: [{ type: 'text-field', label: 'field 1', value: '' }],
          entity1: [
            {
              type: 'entity',
              label: 'field 2',
              properties: {
                field2: [
                  {
                    type: 'text-field',
                    label: 'field 2',
                    value: '',
                  },
                ],
                field3: [
                  {
                    type: 'text-field',
                    label: 'field 3',
                    value: '',
                  },
                ],
                field4: [
                  {
                    type: 'text-field',
                    label: 'field 4',
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
          type: 'text-field',
        },
        {
          key: ['entity1', 'field4'],
          label: 'field 4',
          type: 'text-field',
        },
      ]);

      expect(documentFieldOptionsToStructure(def)).toEqual([['entity1', ['field2', 'field4']]]);
    });
  });

  describe('expandModelFields', () => {
    test('expandModelFields', () => {
      expect(
        expandModelFields([
          ['field1', ['field1.1', 'field1.2', 'field1.3']],
          ['field2', ['field2.1', 'field2.2', 'field2.3']],
          'field3',
        ])
      ).toEqual([
        ['field1', 'field1.1'],
        ['field1', 'field1.2'],
        ['field1', 'field1.3'],
        ['field2', 'field2.1'],
        ['field2', 'field2.2'],
        ['field2', 'field2.3'],
        ['field3'],
      ]);
    });
  });
});
