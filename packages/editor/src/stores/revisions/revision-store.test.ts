import { createRevisionStore } from './revisions-store';
import { CaptureModel, StructureType } from '@capture-models/types';

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
      const store = createRevisionStore({
        captureModel: models()[0],
        initialRevision: '7c26cf57-5950-4849-b533-11e0ee4afa4b',
      });

      expect(store.getState().currentRevisionId).toEqual('7c26cf57-5950-4849-b533-11e0ee4afa4b');

      expect(store.getState().currentRevision).toMatchInlineSnapshot(`
        Object {
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
          "id": undefined,
          "revision": Object {
            "fields": Array [
              "name",
            ],
            "id": "7c26cf57-5950-4849-b533-11e0ee4afa4b",
            "structureId": "31b27c9b-2388-47df-b6f4-73fb4878c1fa",
          },
          "source": "structure",
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
      const mod: CaptureModel = models()[num];
      const revId = (mod.structure as StructureType<'choice'>).items[0].id;
      const store = createRevisionStore({
        captureModel: models()[num],
        initialRevision: revision ? revId : undefined,
      });

      return [store, store.getActions(), revId] as const;
    };

    test('selectors are available on model', () => {
      const [store, { selectRevision }, revId] = selectorStore();
      expect(store.getState().selector.availableSelectors).toEqual([]);
      selectRevision({ revisionId: revId });
      expect(store.getState().selector.availableSelectors).toEqual([{ id: '0c15c2b8-48e9-4c83-b77e-054cd8215f93', state: null, type: 'box-selector' }]);
    });

    test('can choose a selector that exists', () => {
      const [store, { chooseSelector }] = selectorStore(true);
      chooseSelector({ selectorId: '0c15c2b8-48e9-4c83-b77e-054cd8215f93' });
      expect(store.getState().selector.currentSelectorId).toEqual('0c15c2b8-48e9-4c83-b77e-054cd8215f93');
    });

    test('can choose a selector that does not exist', () => {
      const [store, { chooseSelector }] = selectorStore();
      chooseSelector({ selectorId: 'DOES NOT EXIST' });
      expect(store.getState().selector.currentSelectorId).toEqual(null);
    });

    test('can choose a selector when one is already selected', () => {
      const [store, { chooseSelector }] = selectorStore(true, 6);
      chooseSelector({ selectorId: '6ffcfd34-4141-4f38-918d-5348e9d42ab5' });
      expect(store.getState().selector.currentSelectorId).toEqual('6ffcfd34-4141-4f38-918d-5348e9d42ab5');
      chooseSelector({ selectorId: '9b25da35-f1fb-4b58-92e4-0eef3d929029' });
      expect(store.getState().selector.currentSelectorId).toEqual('9b25da35-f1fb-4b58-92e4-0eef3d929029');
    });

    test('no top level selector is selected by default', () => {
      const [store] = selectorStore(true, 6);
      expect(store.getState().selector.topLevelSelector).toEqual(null);
    });

    test('can choose a top level selector', () => {
      const [store, { setTopLevelSelector }] = selectorStore(true, 6);
      setTopLevelSelector({ selectorId: '6ffcfd34-4141-4f38-918d-5348e9d42ab5' });
      expect(store.getState().selector.topLevelSelector).toEqual('6ffcfd34-4141-4f38-918d-5348e9d42ab5');
    });

    test('can clear the current selector', () => {
      const [store, { chooseSelector, clearSelector }] = selectorStore(true, 5);

      chooseSelector({ selectorId: '0c15c2b8-48e9-4c83-b77e-054cd8215f93' });
      expect(store.getState().selector.currentSelectorId).toEqual('0c15c2b8-48e9-4c83-b77e-054cd8215f93');

      clearSelector();
      expect(store.getState().selector.currentSelectorId).toEqual(null);
    });

    test('can clear the current selector when no selector is chosen', () => {
      const [, { clearSelector }] = selectorStore(true);

      expect(() => clearSelector()).not.toThrow();
    });

    test('can clear the current top level selector', () => {
      const [store, { setTopLevelSelector, clearTopLevelSelector }] = selectorStore(true);

      setTopLevelSelector({ selectorId: '0c15c2b8-48e9-4c83-b77e-054cd8215f93' });
      expect(store.getState().selector.topLevelSelector).toEqual('0c15c2b8-48e9-4c83-b77e-054cd8215f93');

      clearTopLevelSelector();
      expect(store.getState().selector.topLevelSelector).toEqual(null);
    });

    test('can build a selector index', () => {
      const [store, { selectRevision }] = selectorStore(false, 7);

      selectRevision({ revisionId: '18e0d089-e87c-448f-9ef2-3282a44cf6d2' });

      expect(true).toBe(true);
    });
  });

  test('create revision', () => {
    const store = createRevisionStore({ captureModel: models()[0] });
    const { createRevision } = store.getActions();

    createRevision({ revisionId: '31b27c9b-2388-47df-b6f4-73fb4878c1fa', cloneMode: 'FORK_TEMPLATE' });

    const { revisions } = store.getState();

    expect(Object.keys(revisions).length).toEqual(3);
  });
});
