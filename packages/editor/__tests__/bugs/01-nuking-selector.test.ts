import { hydrateRevisionStore } from '../../src/stores/revisions/revisions-store';

describe('1. Nuking selector bug', () => {
  test('it should not revise the selector', () => {
    const state = {
      revisions: {
        '9c2c6558-703d-4276-ac44-01c78e66ecef': {
          captureModelId: 'fb97bec1-5ff4-4413-bdb2-96fff1b70ae3',
          revision: {
            id: '9c2c6558-703d-4276-ac44-01c78e66ecef',
            fields: ['regionOfInterest'],
            approved: true,
            structureId: '9c2c6558-703d-4276-ac44-01c78e66ecef',
            label: 'Default',
          },
          source: 'canonical',
          document: {
            id: '7d313298-e8d7-4ecf-a459-b6e9768013e3',
            type: 'entity',
            label: 'Untitled document',
            properties: {
              regionOfInterest: [
                {
                  id: 'e2ab2dd6-a80d-41ea-b289-38966eb092f5',
                  type: 'text-field',
                  label: 'regionOfInterest test test',
                  value: '',
                  description: 'test',
                  selector: {
                    id: '4d60c63c-d3e3-40e7-9243-a0b98a6daba6',
                    type: 'box-selector',
                    state: null,
                  },
                },
              ],
            },
          },
        },
        '5b21c821-0600-4530-80bf-43fbe09e4469': {
          captureModelId: 'fb97bec1-5ff4-4413-bdb2-96fff1b70ae3',
          revision: {
            structureId: '9c2c6558-703d-4276-ac44-01c78e66ecef',
            approved: false,
            label: 'Default',
            id: '5b21c821-0600-4530-80bf-43fbe09e4469',
            fields: ['regionOfInterest'],
            status: 'draft',
            revises: '9c2c6558-703d-4276-ac44-01c78e66ecef',
            authors: ['urn:madoc:user:1'],
            deletedFields: null,
          },
          document: {
            id: '7d313298-e8d7-4ecf-a459-b6e9768013e3',
            type: 'entity',
            label: 'Untitled document',
            properties: {
              regionOfInterest: [
                {
                  id: '05127e2f-4b7e-4dfe-8061-8ca6914b02ae',
                  type: 'text-field',
                  label: 'regionOfInterest test test',
                  value: 'test again',
                  revises: 'e2ab2dd6-a80d-41ea-b289-38966eb092f5',
                  description: 'test',
                  selector: {
                    id: 'bd8599f7-98f1-48ef-b926-61b53a7a9711',
                    type: 'box-selector',
                    state: null,
                  },
                  revision: '5b21c821-0600-4530-80bf-43fbe09e4469',
                },
              ],
            },
          },
          source: 'structure',
        },
      },
      revisionEditMode: true,
      currentRevisionId: '5b21c821-0600-4530-80bf-43fbe09e4469',
      currentRevision: {
        captureModelId: 'fb97bec1-5ff4-4413-bdb2-96fff1b70ae3',
        revision: {
          structureId: '9c2c6558-703d-4276-ac44-01c78e66ecef',
          approved: false,
          label: 'Default',
          id: '5b21c821-0600-4530-80bf-43fbe09e4469',
          fields: ['regionOfInterest'],
          status: 'draft',
          revises: '9c2c6558-703d-4276-ac44-01c78e66ecef',
          authors: ['urn:madoc:user:1'],
          deletedFields: null,
        },
        document: {
          id: '7d313298-e8d7-4ecf-a459-b6e9768013e3',
          type: 'entity',
          label: 'Untitled document',
          properties: {
            regionOfInterest: [
              {
                id: '05127e2f-4b7e-4dfe-8061-8ca6914b02ae',
                type: 'text-field',
                label: 'regionOfInterest test test',
                value: 'test again',
                revises: 'e2ab2dd6-a80d-41ea-b289-38966eb092f5',
                description: 'test',
                selector: {
                  id: 'bd8599f7-98f1-48ef-b926-61b53a7a9711',
                  type: 'box-selector',
                  state: null,
                },
                revision: '5b21c821-0600-4530-80bf-43fbe09e4469',
              },
            ],
          },
        },
        source: 'structure',
      },
      unsavedRevisionIds: [],
      currentRevisionReadMode: false,
      revisionSubtreePath: [],
      revisionSelectedFieldProperty: null,
      revisionSelectedFieldInstance: null,
      revisionSubtree: {
        id: '7d313298-e8d7-4ecf-a459-b6e9768013e3',
        type: 'entity',
        label: 'Untitled document',
        properties: {
          regionOfInterest: [
            {
              id: '05127e2f-4b7e-4dfe-8061-8ca6914b02ae',
              type: 'text-field',
              label: 'regionOfInterest test test',
              value: 'test again',
              revises: 'e2ab2dd6-a80d-41ea-b289-38966eb092f5',
              description: 'test',
              selector: {
                id: 'bd8599f7-98f1-48ef-b926-61b53a7a9711',
                type: 'box-selector',
                state: null,
              },
              revision: '5b21c821-0600-4530-80bf-43fbe09e4469',
            },
          ],
        },
      },
      revisionSubtreeFieldKeys: ['regionOfInterest'],
      revisionSubtreeFields: [
        {
          term: 'regionOfInterest',
          value: [
            {
              id: '05127e2f-4b7e-4dfe-8061-8ca6914b02ae',
              type: 'text-field',
              label: 'regionOfInterest test test',
              value: 'test again',
              revises: 'e2ab2dd6-a80d-41ea-b289-38966eb092f5',
              description: 'test',
              selector: {
                id: 'bd8599f7-98f1-48ef-b926-61b53a7a9711',
                type: 'box-selector',
                state: null,
              },
              revision: '5b21c821-0600-4530-80bf-43fbe09e4469',
            },
          ],
        },
      ],
      structure: {
        id: '16e4789c-6866-4271-bdfd-ee5220e9ffeb',
        type: 'choice',
        description: 'test',
        label: 'First project',
        items: [
          {
            id: '9c2c6558-703d-4276-ac44-01c78e66ecef',
            type: 'model',
            description: 'test test',
            label: 'Default',
            fields: ['regionOfInterest'],
            instructions: 'test test test test',
          },
        ],
      },
      idStack: ['9c2c6558-703d-4276-ac44-01c78e66ecef'],
      isThankYou: false,
      isPreviewing: false,
      structureMap: {
        '9c2c6558-703d-4276-ac44-01c78e66ecef': {
          id: '9c2c6558-703d-4276-ac44-01c78e66ecef',
          structure: {
            id: '9c2c6558-703d-4276-ac44-01c78e66ecef',
            type: 'model',
            description: 'test test',
            label: 'Default',
            fields: ['regionOfInterest'],
            instructions: 'test test test test',
          },
          path: [
            '16e4789c-6866-4271-bdfd-ee5220e9ffeb',
            '16e4789c-6866-4271-bdfd-ee5220e9ffeb',
            '9c2c6558-703d-4276-ac44-01c78e66ecef',
          ],
        },
        '16e4789c-6866-4271-bdfd-ee5220e9ffeb': {
          id: '16e4789c-6866-4271-bdfd-ee5220e9ffeb',
          structure: {
            id: '16e4789c-6866-4271-bdfd-ee5220e9ffeb',
            type: 'choice',
            description: 'test',
            label: 'First project',
            items: [
              {
                id: '9c2c6558-703d-4276-ac44-01c78e66ecef',
                type: 'model',
                description: 'test test',
                label: 'Default',
                fields: ['regionOfInterest'],
                instructions: 'test test test test',
              },
            ],
          },
          path: ['16e4789c-6866-4271-bdfd-ee5220e9ffeb'],
        },
      },
      currentStructureId: '9c2c6558-703d-4276-ac44-01c78e66ecef',
      currentStructure: {
        id: '9c2c6558-703d-4276-ac44-01c78e66ecef',
        type: 'model',
        description: 'test test',
        label: 'Default',
        fields: ['regionOfInterest'],
        instructions: 'test test test test',
      },
      choiceStack: [
        {
          id: '9c2c6558-703d-4276-ac44-01c78e66ecef',
          structure: {
            id: '9c2c6558-703d-4276-ac44-01c78e66ecef',
            type: 'model',
            description: 'test test',
            label: 'Default',
            fields: ['regionOfInterest'],
            instructions: 'test test test test',
          },
          path: [
            '16e4789c-6866-4271-bdfd-ee5220e9ffeb',
            '16e4789c-6866-4271-bdfd-ee5220e9ffeb',
            '9c2c6558-703d-4276-ac44-01c78e66ecef',
          ],
        },
      ],
      selector: {
        availableSelectors: [
          {
            id: 'bd8599f7-98f1-48ef-b926-61b53a7a9711',
            type: 'box-selector',
            state: null,
          },
        ],
        currentSelectorId: 'bd8599f7-98f1-48ef-b926-61b53a7a9711',
        selectorPreviewData: {},
        currentSelectorState: null,
        topLevelSelector: null,
        visibleSelectorIds: [],
        selectorPaths: {
          'bd8599f7-98f1-48ef-b926-61b53a7a9711': [['regionOfInterest', '05127e2f-4b7e-4dfe-8061-8ca6914b02ae']],
        },
      },
      visibleCurrentLevelSelectorIds: ['bd8599f7-98f1-48ef-b926-61b53a7a9711'],
      revisionAdjacentSubtreeFields: {
        fields: [],
      },
      visibleAdjacentSelectorIds: [],
      resolvedSelectors: [
        {
          id: 'bd8599f7-98f1-48ef-b926-61b53a7a9711',
          type: 'box-selector',
          state: null,
        },
      ],
      visibleCurrentLevelSelectors: [
        {
          id: 'bd8599f7-98f1-48ef-b926-61b53a7a9711',
          type: 'box-selector',
          state: null,
        },
      ],
      visibleAdjacentSelectors: [],
    };

    const store = hydrateRevisionStore(state);

    const actions = store.getActions();

    actions.updateSelector({
      selectorId: 'bd8599f7-98f1-48ef-b926-61b53a7a9711',
      state: {
        x: 1826,
        y: 307,
        width: 431,
        height: 272,
      },
    });

    const newState: any = store.getState();

    expect(newState.currentRevision.document.properties.regionOfInterest[0].selector.revisedBy).not.toBeDefined();
  });
});
