import { createFormFieldReducer } from './current-form';
import { CaptureModel } from '../types/capture-model';

describe('current form', () => {
  describe('createFormFieldReducer', () => {
    const doc: CaptureModel = require('../../fixtures/simple.json');
    test('simple flat fields', () => {
      const reducer = createFormFieldReducer(doc.document);

      expect(['name', 'description'].reduce(reducer, [])).toMatchInlineSnapshot(`
              Array [
                Object {
                  "list": Array [
                    Object {
                      "label": "Enter the name of the book",
                      "selector": Object {
                        "state": null,
                        "type": "box-selector",
                      },
                      "term": "name",
                      "type": "text-box",
                      "value": "The Hitchhiker's Guide to the Galaxy",
                    },
                  ],
                  "type": "fields",
                },
                Object {
                  "list": Array [
                    Object {
                      "label": "Enter a description of the book",
                      "term": "description",
                      "type": "text-area",
                      "value": "The Hitchhiker's Guide to the Galaxy is the first of five books in the Hitchhiker's Guide to the Galaxy comedy science fiction \\"trilogy\\" by Douglas Adams. The novel is an adaptation of the first four parts of Adams' radio series of the same name.",
                    },
                  ],
                  "type": "fields",
                },
              ]
          `);
    });

    test('nested model', () => {
      const reducer = createFormFieldReducer(doc.document);

      // @ts-ignore
      expect(['name', ['review', ['name', 'reviewBody']]].reduce(reducer, [])).toMatchInlineSnapshot(`
        Array [
          Object {
            "list": Array [
              Object {
                "label": "Enter the name of the book",
                "selector": Object {
                  "state": null,
                  "type": "box-selector",
                },
                "term": "name",
                "type": "text-box",
                "value": "The Hitchhiker's Guide to the Galaxy",
              },
            ],
            "type": "fields",
          },
          Object {
            "list": Array [
              Object {
                "conformsTo": "Review",
                "fields": Array [
                  Object {
                    "list": Array [
                      Object {
                        "label": "Short name of your review",
                        "term": "name",
                        "type": "text-box",
                        "value": "A masterpiece of literature",
                      },
                    ],
                    "type": "fields",
                  },
                  Object {
                    "list": Array [
                      Object {
                        "label": "Write your review",
                        "term": "reviewBody",
                        "type": "text-area",
                        "value": "Very simply, the book is one of the funniest SF spoofs ever written, with hyperbolic ideas folding in on themselves",
                      },
                    ],
                    "type": "fields",
                  },
                ],
                "label": "Review",
                "type": "entity",
              },
              Object {
                "conformsTo": "Review",
                "fields": Array [
                  Object {
                    "list": Array [
                      Object {
                        "label": "Short name of your review",
                        "term": "name",
                        "type": "text-box",
                        "value": "",
                      },
                    ],
                    "type": "fields",
                  },
                  Object {
                    "list": Array [
                      Object {
                        "label": "Write your review",
                        "term": "reviewBody",
                        "type": "text-area",
                        "value": "",
                      },
                    ],
                    "type": "fields",
                  },
                ],
                "label": "Review",
                "type": "entity",
              },
              Object {
                "conformsTo": "Review",
                "fields": Array [
                  Object {
                    "list": Array [
                      Object {
                        "label": "Short name of your review",
                        "term": "name",
                        "type": "text-box",
                        "value": "A great book",
                      },
                    ],
                    "type": "fields",
                  },
                  Object {
                    "list": Array [
                      Object {
                        "label": "Write your review",
                        "term": "reviewBody",
                        "type": "text-area",
                        "value": "It's very great",
                      },
                    ],
                    "type": "fields",
                  },
                ],
                "label": "Review",
                "type": "entity",
              },
            ],
            "type": "documents",
          },
        ]
      `);
    });
  });
});
