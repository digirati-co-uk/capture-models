import { serialiseCaptureModel } from '../serialise-capture-model';
import uuid from 'uuid';
import { CaptureModel } from '@capture-models/types';

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

  test('simple model with selector', () => {
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
            selector: {
              id: uuid.v4(),
              type: 'box-selector',
              state: {
                x: 10,
                y: 20,
                width: 130,
                height: 140,
              },
            },
            value: 'Some value of the label',
          },
        ],
      },
    };

    expect(serialiseCaptureModel(complexModelWithEntity, { addSelectors: false })).toMatchInlineSnapshot(`
      Object {
        "label": "Some value of the label",
      }
    `);

    expect(serialiseCaptureModel(complexModelWithEntity, { addSelectors: true })).toMatchInlineSnapshot(`
      Object {
        "label": Object {
          "selector": Object {
            "height": 140,
            "width": 130,
            "x": 10,
            "y": 20,
          },
          "value": "Some value of the label",
        },
      }
    `);

    expect(serialiseCaptureModel(complexModelWithEntity, { addSelectors: true, rdfValue: true }))
      .toMatchInlineSnapshot(`
      Object {
        "label": Object {
          "@value": "Some value of the label",
          "selector": Object {
            "height": 140,
            "width": 130,
            "x": 10,
            "y": 20,
          },
        },
      }
    `);
  });
  test('simple model with multiple selectors', () => {
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
            selector: {
              id: uuid.v4(),
              type: 'box-selector',
              state: {
                x: 10,
                y: 20,
                width: 130,
                height: 140,
              },
            },
            value: 'Some value of the label',
          },
          {
            id: uuid.v4(),
            label: 'The label',
            type: 'text-field',
            selector: {
              id: uuid.v4(),
              type: 'box-selector',
              state: {
                x: 20,
                y: 40,
                width: 160,
                height: 180,
              },
            },
            value: 'Second value',
          },
          {
            id: uuid.v4(),
            label: 'The label',
            type: 'text-field',
            selector: {
              id: uuid.v4(),
              type: 'box-selector',
              state: null,
            },
            value: 'Some value of the label',
          },
        ],
      },
    };

    expect(serialiseCaptureModel(complexModelWithEntity, { addSelectors: false })).toMatchInlineSnapshot(`
Object {
  "label": Array [
    "Some value of the label",
    "Second value",
    "Some value of the label",
  ],
}
`);

    expect(serialiseCaptureModel(complexModelWithEntity, { addSelectors: true })).toMatchInlineSnapshot(`
Object {
  "label": Array [
    Object {
      "selector": Object {
        "height": 140,
        "width": 130,
        "x": 10,
        "y": 20,
      },
      "value": "Some value of the label",
    },
    Object {
      "selector": Object {
        "height": 180,
        "width": 160,
        "x": 20,
        "y": 40,
      },
      "value": "Second value",
    },
    "Some value of the label",
  ],
}
`);

    expect(serialiseCaptureModel(complexModelWithEntity, { addSelectors: true, rdfValue: true }))
      .toMatchInlineSnapshot(`
Object {
  "label": Array [
    Object {
      "@value": "Some value of the label",
      "selector": Object {
        "height": 140,
        "width": 130,
        "x": 10,
        "y": 20,
      },
    },
    Object {
      "@value": "Second value",
      "selector": Object {
        "height": 180,
        "width": 160,
        "x": 20,
        "y": 40,
      },
    },
    "Some value of the label",
  ],
}
`);
    expect(
      serialiseCaptureModel(complexModelWithEntity, { addSelectors: true, rdfValue: true, normalisedValueLists: true })
    ).toMatchInlineSnapshot(`
Object {
  "label": Array [
    Object {
      "@value": "Some value of the label",
      "selector": Object {
        "height": 140,
        "width": 130,
        "x": 10,
        "y": 20,
      },
    },
    Object {
      "@value": "Second value",
      "selector": Object {
        "height": 180,
        "width": 160,
        "x": 20,
        "y": 40,
      },
    },
    Object {
      "@value": "Some value of the label",
    },
  ],
}
`);
  });

  test('simple model with entity selector', () => {
    const complexModelWithEntity: CaptureModel['document'] = {
      id: uuid.v4(),
      type: 'entity',
      label: 'My form',
      properties: {
        people: [
          {
            id: uuid.v4(),
            type: 'entity',
            label: 'Person',
            allowMultiple: true,
            selector: {
              id: uuid.v4(),
              type: 'box-selector',
              state: {
                x: 10,
                y: 20,
                width: 130,
                height: 140,
              },
            },
            properties: {
              name: [
                {
                  id: uuid.v4(),
                  label: 'Name',
                  type: 'text-field',
                  value: 'Some value of the label',
                },
              ],
            },
          },
        ],
        details: [
          {
            id: uuid.v4(),
            type: 'entity',
            label: 'Details',
            allowMultiple: false,
            selector: {
              id: uuid.v4(),
              type: 'box-selector',
              state: {
                x: 20,
                y: 40,
                width: 160,
                height: 180,
              },
            },
            properties: {
              label: [
                {
                  id: uuid.v4(),
                  label: 'Label',
                  type: 'text-field',
                  value: 'The label of an object',
                },
              ],
              description: [
                {
                  id: uuid.v4(),
                  label: 'Description',
                  type: 'text-field',
                  value: 'The description of an object',
                },
              ],
            },
          },
        ],
      },
    };

    expect(serialiseCaptureModel(complexModelWithEntity)).toMatchInlineSnapshot(`
      Object {
        "details": Object {
          "description": "The description of an object",
          "label": "The label of an object",
        },
        "people": Array [
          Object {
            "name": "Some value of the label",
          },
        ],
      }
    `);
    expect(serialiseCaptureModel(complexModelWithEntity, { addSelectors: true })).toMatchInlineSnapshot(`
      Object {
        "details": Object {
          "properties": Object {
            "description": "The description of an object",
            "label": "The label of an object",
          },
          "selector": Object {
            "height": 180,
            "width": 160,
            "x": 20,
            "y": 40,
          },
        },
        "people": Array [
          Object {
            "properties": Object {
              "name": "Some value of the label",
            },
            "selector": Object {
              "height": 140,
              "width": 130,
              "x": 10,
              "y": 20,
            },
          },
        ],
      }
    `);
  });
});
