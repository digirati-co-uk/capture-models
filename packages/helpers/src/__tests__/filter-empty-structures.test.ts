import { CaptureModel } from '@capture-models/types';
import { filterEmptyStructureFields } from '../filter-empty-structure-fields';
import { filterEmptyStructures } from '../filter-empty-structures';

const filterEmpty = require('../../../../fixtures/06-invalid/01-empty-structure.json');

describe('filterEmptyStructures', () => {
  test('filterEmptyStructureFields - non-nested', () => {
    expect(filterEmptyStructureFields(['a', 'b', 'c'], { properties: { a: [], c: [{}] } } as any)).toEqual(['c']);
  });

  test('filterEmptyStructureFields - nested', () => {
    expect(
      filterEmptyStructureFields(['a', ['b', ['c', 'd']]], {
        properties: {
          a: [], // empty.
          b: [
            {
              type: 'entity',
              properties: {
                c: [], // empty.
                d: [{}], // not empty.
              },
            },
          ],
        },
      } as any)
    ).toEqual([['b', ['d']]]);
  });

  test('it can filter empty structures', () => {
    const model = filterEmpty as CaptureModel;

    const structure = filterEmptyStructures(model);

    expect(structure).toMatchInlineSnapshot(`
      Object {
        "description": "Contains single choice with single text field",
        "id": "cdee3083-5f74-43c1-9d80-d97349f5fa69",
        "items": Array [
          Object {
            "fields": Array [
              "label",
            ],
            "id": "f0c7f99c-9e4b-4211-8dc5-f94c1287690b",
            "label": "Completely valid",
            "type": "model",
          },
          Object {
            "fields": Array [
              "label",
            ],
            "id": "c9db4483-9421-4370-abab-2c24ee656de2",
            "label": "Partially valid",
            "type": "model",
          },
          Object {
            "description": "This is a nested choice",
            "id": "983b5776-4a2a-4107-a50d-eab94f0d2c0e",
            "items": Array [
              Object {
                "fields": Array [
                  "label",
                ],
                "id": "c40a1d4b-6bcc-4dd0-89f3-f8146a0837d0",
                "label": "Nested - partially valid",
                "type": "model",
              },
              Object {
                "fields": Array [
                  "label",
                ],
                "id": "6961fa68-0886-4bbe-b680-9f6004a2fe12",
                "label": "Nested - completely valid",
                "type": "model",
              },
            ],
            "label": "Nested choice - partially valid",
            "type": "choice",
          },
          Object {
            "description": "The second choice in the list",
            "fields": Array [
              Array [
                "person",
                Array [
                  "firstName",
                  "lastName",
                ],
              ],
            ],
            "id": "3cb849fe-e2fe-4d0d-87ab-dff1519c6c3c",
            "label": "Valid Person",
            "type": "model",
          },
          Object {
            "description": "The second choice in the list",
            "fields": Array [
              Array [
                "person",
                Array [
                  "firstName",
                ],
              ],
            ],
            "id": "bd34d28a-0299-4407-af0a-113f027bd3d0",
            "label": "Partially valid person",
            "type": "model",
          },
          Object {
            "description": "This is a nested choice",
            "id": "0c1675fc-96d0-42f3-bfb9-f9f8fa56ffa0",
            "items": Array [
              Object {
                "description": "The second choice in the list",
                "fields": Array [
                  Array [
                    "person",
                    Array [
                      "firstName",
                      "lastName",
                    ],
                  ],
                ],
                "id": "3404e64c-dae4-470a-a1b0-3f1d453c80c6",
                "label": "Valid Person",
                "type": "model",
              },
              Object {
                "description": "The second choice in the list",
                "fields": Array [
                  Array [
                    "person",
                    Array [
                      "firstName",
                    ],
                  ],
                ],
                "id": "77a0b28d-d072-4862-a0d1-cb23d17f9fe5",
                "label": "Partially valid person",
                "type": "model",
              },
            ],
            "label": "Partially valid choice",
            "type": "choice",
          },
        ],
        "label": "invalid - empty structure",
        "type": "choice",
      }
    `);
  });
});
