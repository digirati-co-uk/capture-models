import { CaptureModel, BaseSelector } from '@capture-models/types';
import { SelectorModel } from './selector-model';
import { traverseDocument } from '@capture-models/helpers';

export function createSelectorStore(document?: CaptureModel['document']): SelectorModel {
  // @todo create revisionSelectorMap with a path that can be used.
  const selectors: BaseSelector[] = [];
  const selectorPaths: { [id: string]: Array<[string, string]> } = {};

  if (document) {
    // We need to record the path to the current item using the propKey and
    // the parents ID. `document.properties.people[].fieldA[]` would be `[ [people, person-id], [fieldA, field-id] ]`
    const recordPath = (field: any, propKey?: string, parent?: any) => {
      if (!field.temp) {
        field.temp = {};
      }
      if (!field.temp.path) {
        if (parent && parent.temp && parent.temp.path) {
          field.temp.path = [...parent.temp.path];
        } else {
          field.temp.path = [];
        }
      }

      if (parent && propKey) {
        field.temp.path.push([propKey, field.id]);
      }
    };
    traverseDocument<{ path: [string, string][] }>(document, {
      visitSelector(selector, parent) {
        if (parent && parent.temp) {
          // We have the path to the selector here: parent.temp.path
          // Now we just need to store this in the state.
          selectorPaths[selector.id] = parent.temp.path || [];
        }
        selectors.push(selector);
      },
      visitField: recordPath,
      beforeVisitEntity: recordPath,
    });
  }

  return {
    availableSelectors: selectors,
    currentSelectorId: null,
    selectorPreviewData: {},
    currentSelectorState: null,
    topLevelSelector: null,
    visibleSelectorIds: [],
    selectorPaths,
  };
}
