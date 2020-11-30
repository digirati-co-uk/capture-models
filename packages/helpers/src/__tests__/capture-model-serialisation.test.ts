import { serialiseCaptureModel } from '../serialise-capture-model';
import uuid from 'uuid';
import { CaptureModel } from '../../../types/src/capture-model';

describe('capture model serialisation', () => {
  test('it can serialise simple models', () => {
    expect(
      serialiseCaptureModel({
        id: uuid.v4(),
        type: 'entity',
        label: 'My form',
        properties: {
          label: [
            {
              id: uuid.v4(),
              label: 'The label',
              type: 'text-field',
              value: 'Test label',
            },
          ],
          name: [
            {
              id: uuid.v4(),
              label: 'Name of person',
              type: 'text-field',
              value: 'Test name',
            },
          ],
        },
      })
    ).toMatchInlineSnapshot(`
      Object {
        "label": "Test label",
        "name": "Test name",
      }
    `);
  });

  test('it can serialise simple models with metadata', () => {
    expect(
      serialiseCaptureModel(
        {
          id: uuid.v4(),
          type: 'entity',
          label: 'My form',
          properties: {
            label: [
              {
                id: uuid.v4(),
                label: 'The label',
                type: 'text-field',
                value: 'Test label',
              },
            ],
            name: [
              {
                id: uuid.v4(),
                label: 'Name of person',
                type: 'text-field',
                value: 'Test name',
              },
            ],
          },
        },
        { addMetadata: true }
      )
    ).toMatchInlineSnapshot(`
Object {
  "__meta__": Object {
    "label": "text-field",
    "name": "text-field",
  },
  "label": "Test label",
  "name": "Test name",
}
`);
  });

  test('it can serialise model with entity', () => {
    const complexModelWithEntity: CaptureModel['document'] = {
      id: uuid.v4(),
      type: 'entity',
      label: 'My form',
      properties: {
        label: [
          {
            id: uuid.v4(),
            label: 'The label',
            type: 'text-field',
            value: '',
          },
        ],
        people: [
          {
            id: uuid.v4(),
            label: 'Name of person',
            type: 'entity',
            properties: {
              name: [
                {
                  id: uuid.v4(),
                  label: 'First name',
                  type: 'text-field',
                  value: 'First persons name',
                },
              ],
              city: [
                {
                  id: uuid.v4(),
                  label: 'City',
                  type: 'text-field',
                  value: 'Aberdeen',
                },
              ],
            },
          },
          {
            id: uuid.v4(),
            label: 'Name of person',
            type: 'entity',
            properties: {
              name: [
                {
                  id: uuid.v4(),
                  label: 'First name',
                  type: 'text-field',
                  value: 'Second persons name',
                },
              ],
              city: [
                {
                  id: uuid.v4(),
                  label: 'City',
                  type: 'text-field',
                  value: 'Glasgow',
                },
              ],
            },
          },
        ],
      },
    };

    expect(serialiseCaptureModel(complexModelWithEntity, { addMetadata: true })).toMatchInlineSnapshot(`
Object {
  "__meta__": Object {
    "label": "text-field",
    "people.city": "text-field",
    "people.name": "text-field",
  },
  "label": "",
  "people": Array [
    Object {
      "city": "Aberdeen",
      "name": "First persons name",
    },
    Object {
      "city": "Glasgow",
      "name": "Second persons name",
    },
  ],
}
`);
  });
});
