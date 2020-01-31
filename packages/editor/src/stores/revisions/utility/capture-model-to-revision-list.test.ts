import { CaptureModel } from '@capture-models/types';
import { captureModelToRevisionList } from './capture-model-to-revision-list';
// @ts-ignore
import single01 from '../../../../../../fixtures/03-revisions/01-single-field-with-revision.json';
// @ts-ignore
import single02 from '../../../../../../fixtures/03-revisions/02-single-field-with-multiple-revisions.json';
// @ts-ignore
import single03 from '../../../../../../fixtures/03-revisions/03-nested-revision.json';
// @ts-ignore
import single04 from '../../../../../../fixtures/03-revisions/04-dual-transcription.json';
// @ts-ignore
import single05 from '../../../../../../fixtures/03-revisions/05-allow-multiple-transcriptions.json';

describe('capture model to revision list', () => {
  test('single-field-with-revision', () => {
    expect(captureModelToRevisionList(single01 as CaptureModel)).toMatchInlineSnapshot(`
      Array [
        Object {
          "document": Object {
            "id": "abc-123",
            "label": "Simple document",
            "properties": Object {
              "name": Array [
                Object {
                  "description": "The name of the thing",
                  "id": "f2",
                  "label": "Name",
                  "revision": "abc-123",
                  "type": "text-field",
                  "value": "Some value that was submitted",
                },
              ],
            },
            "type": "entity",
          },
          "revision": Object {
            "fields": Array [
              "name",
            ],
            "id": "abc-123",
          },
        },
      ]
    `);
  });

  test('single-field-with-revision', () => {
    expect(captureModelToRevisionList(single02 as CaptureModel)).toMatchInlineSnapshot(`
      Array [
        Object {
          "document": Object {
            "id": "test-person-a",
            "label": "Simple document",
            "properties": Object {
              "name": Array [
                Object {
                  "description": "The name of the thing",
                  "id": "f2",
                  "label": "Name",
                  "revision": "test-person-a",
                  "type": "text-field",
                  "value": "Person A wrote this",
                },
              ],
            },
            "type": "entity",
          },
          "revision": Object {
            "fields": Array [
              "name",
            ],
            "id": "test-person-a",
          },
        },
        Object {
          "document": Object {
            "id": "test-person-b",
            "label": "Simple document",
            "properties": Object {
              "name": Array [
                Object {
                  "description": "The name of the thing",
                  "id": "f3",
                  "label": "Name",
                  "revision": "test-person-b",
                  "type": "text-field",
                  "value": "Person B wrote this",
                },
              ],
            },
            "type": "entity",
          },
          "revision": Object {
            "fields": Array [
              "name",
            ],
            "id": "test-person-b",
          },
        },
      ]
    `);
  });

  test('nested-revision', () => {
    expect(captureModelToRevisionList(single03 as CaptureModel)).toMatchInlineSnapshot(`
      Array [
        Object {
          "document": Object {
            "id": "abc-123",
            "label": "Nested choices",
            "properties": Object {
              "person": Array [
                Object {
                  "id": "e2",
                  "label": "Person",
                  "properties": Object {
                    "firstName": Array [
                      Object {
                        "id": "f4",
                        "label": "First name",
                        "revision": "abc-123",
                        "type": "text-field",
                        "value": "Some value",
                      },
                    ],
                  },
                  "type": "entity",
                },
              ],
            },
            "type": "entity",
          },
          "revision": Object {
            "fields": Array [
              Array [
                "person",
                Array [
                  "firstName",
                  "lastName",
                ],
              ],
              "name",
            ],
            "id": "abc-123",
          },
        },
      ]
    `);
  });

  test('dual-transcription', () => {
    expect(captureModelToRevisionList(single04 as CaptureModel)).toMatchInlineSnapshot(`
      Array [
        Object {
          "document": Object {
            "id": "test-person-a",
            "label": "Name of entity",
            "properties": Object {
              "transcription": Array [
                Object {
                  "allowMultiple": false,
                  "id": "f2",
                  "label": "Transcription",
                  "revision": "test-person-a",
                  "type": "text-field",
                  "value": "Person A created this one",
                },
              ],
            },
            "type": "entity",
          },
          "revision": Object {
            "fields": Array [
              "transcription",
            ],
            "id": "test-person-a",
          },
        },
        Object {
          "document": Object {
            "id": "test-person-b",
            "label": "Name of entity",
            "properties": Object {
              "transcription": Array [
                Object {
                  "allowMultiple": false,
                  "id": "f3",
                  "label": "Transcription",
                  "revision": "test-person-b",
                  "type": "text-field",
                  "value": "Person B created this one",
                },
              ],
            },
            "type": "entity",
          },
          "revision": Object {
            "fields": Array [
              "transcription",
            ],
            "id": "test-person-b",
          },
        },
      ]
    `);
  });

  test('dual-transcription', () => {
    expect(captureModelToRevisionList(single05 as CaptureModel)).toMatchInlineSnapshot(`
      Array [
        Object {
          "document": Object {
            "id": "test-person-a",
            "label": "Name of entity",
            "properties": Object {
              "transcription": Array [
                Object {
                  "allowMultiple": true,
                  "id": "f2",
                  "label": "Transcription",
                  "revision": "test-person-a",
                  "type": "text-field",
                  "value": "Person A created this one",
                },
              ],
            },
            "type": "entity",
          },
          "revision": Object {
            "approved": true,
            "fields": Array [
              "transcription",
            ],
            "id": "test-person-a",
          },
        },
        Object {
          "document": Object {
            "id": "test-person-b",
            "label": "Name of entity",
            "properties": Object {
              "transcription": Array [
                Object {
                  "allowMultiple": true,
                  "id": "f3",
                  "label": "Transcription",
                  "revision": "test-person-b",
                  "type": "text-field",
                  "value": "Person B created this one, to override Person A's one",
                },
              ],
            },
            "type": "entity",
          },
          "revision": Object {
            "fields": Array [
              "transcription",
            ],
            "id": "test-person-b",
            "revises": "test-person-a",
          },
        },
        Object {
          "document": Object {
            "id": "test-person-c",
            "label": "Name of entity",
            "properties": Object {
              "transcription": Array [
                Object {
                  "allowMultiple": true,
                  "id": "f4",
                  "label": "Transcription",
                  "revision": "test-person-c",
                  "type": "text-field",
                  "value": "Person C created this one",
                },
              ],
            },
            "type": "entity",
          },
          "revision": Object {
            "fields": Array [
              "transcription",
            ],
            "id": "test-person-c",
          },
        },
      ]
    `);
  });
});
