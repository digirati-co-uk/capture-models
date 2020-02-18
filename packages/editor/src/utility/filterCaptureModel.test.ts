import { filterCaptureModel } from './filter-capture-model';
import { CaptureModel } from '@capture-models/types';

describe('filterCaptureModel', () => {
  const personModel: CaptureModel = require('../../../../fixtures/02-nesting/05-nested-model-multiple.json');
  test('non-filter entity maintains structure', () => {
    const filtered = filterCaptureModel(
      'something',
      personModel.document,
      [
        ['person', 'firstName'],
        ['person', 'lastName'],
      ],
      () => true
    );

    expect(filtered).toMatchInlineSnapshot(`
      Object {
        "description": "",
        "id": "e1",
        "label": "Nested choices",
        "properties": Object {
          "person": Array [
            Object {
              "allowMultiple": true,
              "description": "Describe a person",
              "id": "e2",
              "label": "Person",
              "labelledBy": "firstName",
              "properties": Object {
                "firstName": Array [
                  Object {
                    "id": "f3",
                    "label": "First name",
                    "type": "text-field",
                    "value": "first first name",
                  },
                ],
                "lastName": Array [
                  Object {
                    "id": "f4",
                    "label": "Last name",
                    "type": "text-field",
                    "value": "first last name",
                  },
                ],
              },
              "type": "entity",
            },
            Object {
              "allowMultiple": true,
              "description": "Describe a person",
              "id": "e3",
              "label": "Person",
              "labelledBy": "firstName",
              "properties": Object {
                "firstName": Array [
                  Object {
                    "id": "f5",
                    "label": "First name",
                    "type": "text-field",
                    "value": "second first name",
                  },
                ],
                "lastName": Array [
                  Object {
                    "id": "f6",
                    "label": "Last name",
                    "type": "text-field",
                    "value": "second last name",
                  },
                ],
              },
              "type": "entity",
            },
          ],
        },
        "type": "entity",
      }
    `);
  });

  test('filter entity maintains structure', () => {
    const filtered = filterCaptureModel('something', personModel.document, [['person', 'firstName']], () => true);

    expect(filtered).toMatchInlineSnapshot(`
      Object {
        "description": "",
        "id": "e1",
        "label": "Nested choices",
        "properties": Object {
          "person": Array [
            Object {
              "allowMultiple": true,
              "description": "Describe a person",
              "id": "e2",
              "label": "Person",
              "labelledBy": "firstName",
              "properties": Object {
                "firstName": Array [
                  Object {
                    "id": "f3",
                    "label": "First name",
                    "type": "text-field",
                    "value": "first first name",
                  },
                ],
              },
              "type": "entity",
            },
            Object {
              "allowMultiple": true,
              "description": "Describe a person",
              "id": "e3",
              "label": "Person",
              "labelledBy": "firstName",
              "properties": Object {
                "firstName": Array [
                  Object {
                    "id": "f5",
                    "label": "First name",
                    "type": "text-field",
                    "value": "second first name",
                  },
                ],
              },
              "type": "entity",
            },
          ],
        },
        "type": "entity",
      }
    `);
  });
});
