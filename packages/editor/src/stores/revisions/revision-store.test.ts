import { createRevisionStore } from './revisions-store';

const models: () => any[] = () => [
  require('../../../../../fixtures/03-revisions/01-single-field-with-revision.json'),
  require('../../../../../fixtures/03-revisions/02-single-field-with-multiple-revisions.json'),
  require('../../../../../fixtures/03-revisions/03-nested-revision.json'),
  require('../../../../../fixtures/03-revisions/04-dual-transcription.json'),
  require('../../../../../fixtures/03-revisions/05-allow-multiple-transcriptions.json'),
  require('../../../../../fixtures/04-selectors/01-simple-selector.json'),
  require('../../../../../fixtures/04-selectors/02-multiple-selectors.json'),
  require('../../../../../fixtures/04-selectors/03-nested-selector.json'),
];

describe('Revision store', () => {
  describe('reading computed revision', () => {
    test('revision exists', () => {
      const store = createRevisionStore({ captureModel: models()[0], initialRevision: 'abc-123' });

      expect(store.getState().currentRevisionId).toEqual('abc-123');

      expect(store.getState().currentRevision).toMatchInlineSnapshot(`
        Object {
          "document": Object {
            "description": "",
            "id": "e1",
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
            "structureId": "c2",
          },
        }
      `);
    });

    test('revision does not exist', () => {
      const store = createRevisionStore({ captureModel: models()[0] });

      expect(store.getState().currentRevision).toBeNull();
    });
  });

  describe('choosing selectors', () => {
    const selectorStore = (revision?: boolean, num = 5) => {
      const store = createRevisionStore({ captureModel: models()[num], initialRevision: revision ? 'c2' : undefined });

      return [store, store.getActions()] as const;
    };

    test('selectors are available on model', () => {
      const [store, { selectRevision }] = selectorStore();
      expect(store.getState().selector.availableSelectors).toEqual([]);
      selectRevision({ revisionId: 'c2' });
      expect(store.getState().selector.availableSelectors).toEqual([{ id: 's1', state: null, type: 'box-selector' }]);
    });

    test('can choose a selector that exists', () => {
      const [store, { chooseSelector }] = selectorStore(true);
      chooseSelector({ selectorId: 's1' });
      expect(store.getState().selector.currentSelectorId).toEqual('s1');
    });

    test('can choose a selector that does not exist', () => {
      const [store, { chooseSelector }] = selectorStore();
      chooseSelector({ selectorId: 'DOES NOT EXIST' });
      expect(store.getState().selector.currentSelectorId).toEqual(null);
    });

    test('can choose a selector when one is already selected', () => {
      const [store, { chooseSelector }] = selectorStore(true, 6);
      chooseSelector({ selectorId: 's1' });
      expect(store.getState().selector.currentSelectorId).toEqual('s1');
      chooseSelector({ selectorId: 's2' });
      expect(store.getState().selector.currentSelectorId).toEqual('s2');
    });

    test('no top level selector is selected by default', () => {
      const [store] = selectorStore(true, 6);
      expect(store.getState().selector.topLevelSelector).toEqual(null);
    });

    test('can choose a top level selector', () => {
      const [store, { setTopLevelSelector }] = selectorStore(true, 6);
      setTopLevelSelector({ selectorId: 's1' });
      expect(store.getState().selector.topLevelSelector).toEqual('s1');
    });

    test('can clear the current selector', () => {
      const [store, { chooseSelector, clearSelector }] = selectorStore(true, 5);

      chooseSelector({ selectorId: 's1' });
      expect(store.getState().selector.currentSelectorId).toEqual('s1');

      clearSelector();
      expect(store.getState().selector.currentSelectorId).toEqual(null);
    });

    test('can clear the current selector when no selector is chosen', () => {
      const [, { clearSelector }] = selectorStore(true);

      expect(() => clearSelector()).not.toThrow();
    });

    test('can clear the current top level selector', () => {
      const [store, { setTopLevelSelector, clearTopLevelSelector }] = selectorStore(true);

      setTopLevelSelector({ selectorId: 's1' });
      expect(store.getState().selector.topLevelSelector).toEqual('s1');

      clearTopLevelSelector();
      expect(store.getState().selector.topLevelSelector).toEqual(null);
    });

    test('can build a selector index', () => {
      const [store, { selectRevision }] = selectorStore(false, 7);

      selectRevision({ revisionId: 'c3' });

      expect(true).toBe(true);
    });
  });

  test('create revision', () => {
    const store = createRevisionStore({ captureModel: models()[0] });
    const { createRevision } = store.getActions();

    createRevision({ revisionId: 'c2', cloneMode: 'FORK_TEMPLATE' });

    const { revisions } = store.getState();

    expect(Object.keys(revisions).length).toEqual(3);
  });
});
