import { CaptureModel } from '@capture-models/types';
import { captureModelToRevisionList } from './capture-model-to-revision-list';
// @ts-ignore
import single01 from '../../../fixtures/03-revisions/01-single-field-with-revision.json';
// @ts-ignore
import single02 from '../../../fixtures/03-revisions/02-single-field-with-multiple-revisions.json';
// @ts-ignore
import single03 from '../../../fixtures/03-revisions/03-nested-revision.json';
// @ts-ignore
import single04 from '../../../fixtures/03-revisions/04-dual-transcription.json';
// @ts-ignore
import single05 from '../../../fixtures/03-revisions/05-allow-multiple-transcriptions.json';

describe('capture model to revision list', () => {
  test('single-field-with-revision', () => {
    expect(captureModelToRevisionList(single01 as CaptureModel)).toMatchInlineSnapshot(`
      Array [
        Object {
          "captureModelId": "b329e009-1c8a-4bed-bfde-c2a587a22f97",
          "document": Object {
            "description": "",
            "id": "3353dc03-9f35-49e7-9b81-4090fa533c64",
            "label": "Simple document",
            "properties": Object {
              "name": Array [
                Object {
                  "description": "The name of the thing",
                  "id": "eafb62d7-71b7-47bd-b887-def8655d8d2a",
                  "label": "Name",
                  "revision": "7c26cf57-5950-4849-b533-11e0ee4afa4b",
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
            "id": "7c26cf57-5950-4849-b533-11e0ee4afa4b",
            "structureId": "31b27c9b-2388-47df-b6f4-73fb4878c1fa",
          },
          "source": "structure",
        },
      ]
    `);
  });

  test('single-field-with-revision', () => {
    expect(captureModelToRevisionList(single02 as CaptureModel)).toMatchInlineSnapshot(`
      Array [
        Object {
          "captureModelId": "93d09b85-9332-4b71-8e27-1294c8a963f3",
          "document": Object {
            "description": "",
            "id": "b3f53013-23cc-45db-825a-12500bf3c20e",
            "label": "Simple document",
            "properties": Object {
              "name": Array [
                Object {
                  "description": "The name of the thing",
                  "id": "baf51d8c-ce99-4bf4-afd0-0ca2092a7784",
                  "label": "Name",
                  "revision": "514c8d52-80b0-49c1-ab97-24a67f29d194",
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
            "id": "514c8d52-80b0-49c1-ab97-24a67f29d194",
          },
          "source": "unknown",
        },
        Object {
          "captureModelId": "93d09b85-9332-4b71-8e27-1294c8a963f3",
          "document": Object {
            "description": "",
            "id": "b3f53013-23cc-45db-825a-12500bf3c20e",
            "label": "Simple document",
            "properties": Object {
              "name": Array [
                Object {
                  "description": "The name of the thing",
                  "id": "205c9b62-48e3-43ff-8853-222dcd357710",
                  "label": "Name",
                  "revision": "b4077dff-3bea-4783-9712-32b52a1146e3",
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
            "id": "b4077dff-3bea-4783-9712-32b52a1146e3",
          },
          "source": "unknown",
        },
      ]
    `);
  });

  test('nested-revision', () => {
    expect(captureModelToRevisionList(single03 as CaptureModel)).toMatchInlineSnapshot(`
      Array [
        Object {
          "captureModelId": "2cc4131d-4f8d-4ceb-b140-48cd513b5e4f",
          "document": Object {
            "description": "",
            "id": "a8d5ff43-adb2-456a-a615-3d24fbfa05f7",
            "label": "Nested choices",
            "properties": Object {
              "person": Array [
                Object {
                  "description": "Describe a person",
                  "id": "5c8a5874-8bca-422c-be71-300612d67c72",
                  "label": "Person",
                  "properties": Object {
                    "firstName": Array [
                      Object {
                        "id": "dda6d8bc-ca6d-48e0-8bcc-a24537586346",
                        "label": "First name",
                        "revision": "fa500021-7408-4318-ab05-ac6e4d4a3096",
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
            "id": "fa500021-7408-4318-ab05-ac6e4d4a3096",
          },
          "source": "unknown",
        },
      ]
    `);
  });

  test('dual-transcription', () => {
    expect(captureModelToRevisionList(single04 as CaptureModel)).toMatchInlineSnapshot(`
      Array [
        Object {
          "captureModelId": "737150d3-2c72-4eeb-9fd4-42ad085cdf7f",
          "document": Object {
            "id": "279e8fb2-13c3-43cc-aff2-2b41d9025828",
            "label": "Name of entity",
            "properties": Object {
              "transcription": Array [
                Object {
                  "allowMultiple": false,
                  "id": "c0ac6fd6-9146-4eac-a2b3-0067bc689cb6",
                  "label": "Transcription",
                  "revision": "04267f75-bb8d-4321-8046-12db3f9d6ceb",
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
            "id": "04267f75-bb8d-4321-8046-12db3f9d6ceb",
          },
          "source": "unknown",
        },
        Object {
          "captureModelId": "737150d3-2c72-4eeb-9fd4-42ad085cdf7f",
          "document": Object {
            "id": "279e8fb2-13c3-43cc-aff2-2b41d9025828",
            "label": "Name of entity",
            "properties": Object {
              "transcription": Array [
                Object {
                  "allowMultiple": false,
                  "id": "c2b68f02-cce4-4a12-940b-d1359d89e807",
                  "label": "Transcription",
                  "revision": "81ab315e-200e-4649-bb11-99db766a5f66",
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
            "id": "81ab315e-200e-4649-bb11-99db766a5f66",
          },
          "source": "unknown",
        },
      ]
    `);
  });

  test('dual-transcription', () => {
    expect(captureModelToRevisionList(single05 as CaptureModel)).toMatchInlineSnapshot(`
Array [
  Object {
    "captureModelId": "143d9c4a-5d4e-4ca2-89f3-dc4bd7b45e3e",
    "document": Object {
      "id": "47e8a9d8-76f8-422b-91af-b457d1c624a0",
      "label": "Name of entity",
      "properties": Object {
        "transcription": Array [
          Object {
            "allowMultiple": true,
            "id": "2666cf79-ef2f-419f-a3f4-038216a89783",
            "label": "Transcription",
            "revises": "1615a172-b2c5-4192-bcc1-606a871b6230",
            "revision": "f496a9aa-25eb-4b1d-9d94-9cdcef03e527",
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
      "id": "f496a9aa-25eb-4b1d-9d94-9cdcef03e527",
      "status": "accepted",
      "structureId": "fd847948-11bf-42ca-bfdd-cab85ea818f3",
    },
    "source": "structure",
  },
  Object {
    "captureModelId": "143d9c4a-5d4e-4ca2-89f3-dc4bd7b45e3e",
    "document": Object {
      "id": "47e8a9d8-76f8-422b-91af-b457d1c624a0",
      "label": "Name of entity",
      "properties": Object {
        "transcription": Array [
          Object {
            "allowMultiple": true,
            "id": "1efd5946-a3a1-484f-a862-710741a3b682",
            "label": "Transcription",
            "revision": "daf3f9d9-2a16-4c1f-8657-3560775bd9eb",
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
      "id": "daf3f9d9-2a16-4c1f-8657-3560775bd9eb",
      "revises": "f496a9aa-25eb-4b1d-9d94-9cdcef03e527",
      "status": "draft",
      "structureId": "fd847948-11bf-42ca-bfdd-cab85ea818f3",
    },
    "source": "structure",
  },
  Object {
    "captureModelId": "143d9c4a-5d4e-4ca2-89f3-dc4bd7b45e3e",
    "document": Object {
      "id": "47e8a9d8-76f8-422b-91af-b457d1c624a0",
      "label": "Name of entity",
      "properties": Object {
        "transcription": Array [
          Object {
            "allowMultiple": true,
            "id": "892f3abe-bbbe-4b1e-9167-a52ec76ea5c1",
            "label": "Transcription",
            "revision": "bb5d55b1-6c38-4bb9-a6e6-ed236347671b",
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
      "id": "bb5d55b1-6c38-4bb9-a6e6-ed236347671b",
      "status": "submitted",
      "structureId": "fd847948-11bf-42ca-bfdd-cab85ea818f3",
    },
    "source": "structure",
  },
]
`);
  });
});
