import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAsyncEffect } from 'use-async-effect';
import produce, { Draft, original } from 'immer';
import { CaptureModel } from '../types/capture-model';
import { FieldTypes } from '../types/field-types';
import { SelectorTypes } from '../types/selector-types';
import { createContext } from '../utility/createContext';

export type UseCaptureModel<Model extends CaptureModel = CaptureModel> = {
  captureModel: Model;
};

export type UseNavigation<Model extends CaptureModel = CaptureModel> = {
  currentView: Model['structure'];
  currentPath: number[];
  pushPath: (index: number) => void;
  popPath: () => void;
  replacePath: (path: number[]) => void;
  resetPath: () => void;
};

export type UseCurrentForm<Model extends CaptureModel = CaptureModel> = {
  // @todo I think current fields needs a discriminator value to differentiate between a document/entity and field.
  currentFields: NestedField<Model['document']>;
  updateFieldValue: (path: Array<[string, number]>, value: any) => void;
  createUpdateFieldValue: (
    partialPath: Array<[string, number]>
  ) => CaptureModelContext['updateFieldValue'];
};

export type UseSelectors<Selector extends SelectorTypes = SelectorTypes> = {
  currentSelectorPath: Array<[string, number]> | null;
  currentSelector: Selector | null;
  updateSelector: (state: Selector['state'], confirm?: boolean) => void;
  setCurrentSelector: (selectorPath: Array<[string, number]>) => void;
  confirmSelector: () => void;
  resetSelector: () => void;
  // @todo possibly reintroduce availableSelectors. Will contain available selectors for the
  //   content to display without being instantiated by the form to support UX cases. The information
  //   is still technically available, so not a huge issue.
  // availableSelectors: Array<{
  //   path: Array<[string, number]>;
  //   selector: SelectorTypes;
  // }>;
  updateCustomSelector: (
    path: Array<[string, number]>,
    state: SelectorTypes['state']
  ) => void;
};

export type CaptureModelContext<
  Selector extends SelectorTypes = SelectorTypes,
  Model extends CaptureModel = CaptureModel
> = UseCaptureModel<Model> &
  UseNavigation<Model> &
  UseCurrentForm<Model> &
  UseSelectors<Selector>;

const [useContext, InternalProvider] = createContext<CaptureModelContext>();

export function useCaptureModel(): UseCaptureModel {
  const { captureModel } = useContext();
  return useMemo(() => ({ captureModel }), [captureModel]);
}

export function useNavigation(): UseNavigation {
  const {
    currentView,
    currentPath,
    pushPath,
    popPath,
    replacePath,
    resetPath,
  } = useContext();

  return useMemo(
    () => ({
      currentView,
      currentPath,
      pushPath,
      popPath,
      replacePath,
      resetPath,
    }),
    [currentView, currentPath, pushPath, popPath, replacePath, resetPath]
  );
}

export function useCurrentForm(): UseCurrentForm {
  const {
    currentFields,
    updateFieldValue,
    createUpdateFieldValue,
  } = useContext();

  return useMemo(
    () => ({ currentFields, updateFieldValue, createUpdateFieldValue }),
    [currentFields, updateFieldValue, createUpdateFieldValue]
  );
}

export function useSelectors(): UseSelectors {
  const {
    currentSelectorPath,
    confirmSelector,
    currentSelector,
    resetSelector,
    setCurrentSelector,
    updateCustomSelector,
    updateSelector,
  } = useContext();
  return useMemo(
    () => ({
      currentSelectorPath,
      confirmSelector,
      currentSelector,
      resetSelector,
      setCurrentSelector,
      updateCustomSelector,
      updateSelector,
    }),
    [
      currentSelectorPath,
      confirmSelector,
      currentSelector,
      resetSelector,
      setCurrentSelector,
      updateCustomSelector,
      updateSelector,
    ]
  );
}

async function getCaptureModel(
  captureModelId?: string,
  captureModel?: CaptureModel
): Promise<CaptureModel> {
  if (captureModel) {
    return captureModel;
  }

  if (captureModelId) {
    // @todo validation of incoming JSON.
    return (await (await fetch(captureModelId)).json()) as CaptureModel;
  }

  throw new Error('You must provide either a captureModel or captureModelId');
}

export const RemoteCaptureModelProvider: React.FC<{
  captureModelId: string;
  loadingState?: () => React.ReactElement;
}> = ({ captureModelId, loadingState, children }) => {
  const [captureModel, setCaptureModel] = useState<CaptureModel | undefined>();

  // load capture model if applicable.
  useAsyncEffect(async isMounted => {
    if (!captureModel) {
      const model = await getCaptureModel(captureModelId);
      if (!isMounted()) return;
      setCaptureModel(model);
    }
  }, []);

  // Return the loading state function (or null) while capture model is loading
  if (!captureModel) {
    return loadingState ? loadingState() : null;
  }

  return (
    <CaptureModelProvider captureModel={captureModel} children={children} />
  );
};

type NestedField<Doc extends CaptureModel['document']> = Array<
  | Array<FieldTypes>
  | Array<
      CaptureModel['document'] & {
        fields: NestedField<CaptureModel['document']>;
      }
    >
>;

const reducer = <Doc extends CaptureModel['document']>(document: Doc) => (
  acc: NestedField<Doc>,
  next: string | [string, string[]]
) => {
  if (typeof next === 'string') {
    acc.push(document.properties[next] as FieldTypes[]);
    return acc;
  }
  const [key, fields] = next;

  // @todo verify this is an array of documents, otherwise invalid capture model.
  const nestedDocs = document.properties[key] as Array<
    CaptureModel['document']
  >;

  acc.push(
    nestedDocs.map(singleDoc => ({
      ...singleDoc,
      fields: fields.reduce(reducer(singleDoc), []),
    }))
  );

  return acc;
};

export function useInternalCurrentFormState<
  Model extends CaptureModel = CaptureModel
>(
  captureModel: Model,
  updateCaptureModel: (newModel: Model) => void,
  currentFieldIds: Array<string | [string, Array<string>]> | null
): UseCurrentForm & {
  updateInternalFieldValue: (
    path: Array<[string, number]>,
    cb: (field: Draft<FieldTypes>, draft: Draft<CaptureModel>) => void
  ) => void;
} {
  const [currentFields, setCurrentFields] = useState<
    NestedField<Model['document']>
  >([]);

  useEffect(() => {
    if (currentFieldIds) {
      setCurrentFields(
        currentFieldIds.reduce(reducer(captureModel.document), [])
      );
    }
  }, [captureModel, captureModel.document, currentFieldIds]);

  const updateInternalFieldValue = useCallback(
    (
      path: Array<[string, number]>,
      cb: (field: Draft<FieldTypes>, draft: Draft<CaptureModel>) => void
    ) => {
      if (currentFieldIds === null) {
        throw new Error('No form selected');
      }
      updateCaptureModel(
        produce((draft: Draft<CaptureModel>) => {
          let cursor: CaptureModel['document'] | FieldTypes = draft.document;
          for (let [term, idx] of path) {
            if (cursor.type === 'entity') {
              cursor = cursor.properties[term][idx];
            } else {
              throw Error(
                `Invalid update path ${path
                  .map(([a, b]) => `${a}:${b}`)
                  .join('/')}`
              );
            }
          }
          const field = cursor as FieldTypes;

          if (!original(field)) {
            throw new Error(
              `Invalid update path ${path
                .map(([a, b]) => `${a}:${b}`)
                .join('/')}`
            );
          }

          cb(field, draft);
          // draft.
        })(captureModel)
      );
    },
    [captureModel, currentFieldIds, updateCaptureModel]
  );

  const updateFieldValue = useCallback(
    (path: Array<[string, number]>, value: any) =>
      updateInternalFieldValue(path, field => {
        field.value = value;
      }),
    [updateInternalFieldValue]
  );

  const createUpdateFieldValue = useCallback(
    (path: Array<[string, number]>) => {
      return (innerPath: Array<[string, number]>, value: any) => {
        return updateFieldValue([...path, ...innerPath], value);
      };
    },
    [updateFieldValue]
  );

  return {
    currentFields,
    updateFieldValue,
    createUpdateFieldValue,
    updateInternalFieldValue,
  };
}

export function useInternalStructureState(
  captureModel: CaptureModel
): UseNavigation {
  // Navigation actions.
  const [currentView, setCurrentView] = useState<CaptureModel['structure']>(
    () => captureModel.structure
  );
  const [currentPath, replacePathRaw] = useState<number[]>([]);

  const replacePath = useCallback(
    (path: number[]) => {
      setCurrentView(
        path.reduce((level, next) => {
          if (level.type === 'choice') {
            return level.items[next];
          }
          return level;
        }, captureModel.structure)
      );
      replacePathRaw(path);
    },
    [captureModel.structure]
  );

  const pushPath = useCallback(
    (index: number) => {
      replacePath([...currentPath, index]);
    },
    [currentPath, replacePath]
  );

  const popPath = useCallback(() => {
    replacePath(currentPath.slice(0, currentPath.length - 1));
  }, [currentPath, replacePath]);

  const resetPath = useCallback(() => {
    replacePath([]);
  }, [replacePath]);

  return {
    currentPath,
    replacePath,
    currentView,
    pushPath,
    popPath,
    resetPath,
  };
}

export function useInternalSelectorState(
  captureModel: CaptureModel,
  updateField: (
    path: Array<[string, number]>,
    cb: (field: Draft<FieldTypes>, draft: Draft<CaptureModel>) => void
  ) => void
): UseSelectors {
  const [currentSelectorPath, setCurrentSelector] = useState<Array<
    [string, number]
  > | null>(null);

  const [
    currentSelectorOriginalState,
    setCurrentSelectorOriginalState,
  ] = useState();

  const [currentSelector, setCurrentSelectorObj] = useState();

  useEffect(() => {
    if (currentSelectorPath) {
      const field = currentSelectorPath.reduce(
        (acc: CaptureModel['document'], [path, idx]) => {
          return acc.properties[path][idx] as CaptureModel['document'];
        },
        captureModel.document
      ) as CaptureModel['document'] | FieldTypes;

      setCurrentSelectorObj(field.selector);
      setCurrentSelectorOriginalState(
        field.selector ? field.selector.state : null
      );
    }
  }, [captureModel.document, currentSelectorPath]);

  const updateCustomSelector = useCallback(
    <Selector extends SelectorTypes>(
      path: Array<[string, number]>,
      value: Selector['state']
    ) => {
      updateField(path, field => {
        if (field.selector) {
          field.selector.state = value;
        }
      });
      // Updates the capture model.
    },
    [updateField]
  );

  const resetSelector = () => {
    // sets the selector to `currentSelectorOriginalState`
    updateSelector(currentSelectorOriginalState);
    // set the current selector to null
    setCurrentSelector(null);
  };
  const confirmSelector = () => {
    // sets the current selector to null
    setCurrentSelector(null);
  };

  const updateSelector = useCallback(
    (state: SelectorTypes['state'], confirm: boolean = false) => {
      updateCustomSelector(currentSelector, state);
      if (confirm) {
        confirmSelector();
      }
      // updates the current selector
    },
    [currentSelector, updateCustomSelector]
  );

  return {
    currentSelectorPath,
    currentSelector,
    updateCustomSelector,
    setCurrentSelector,
    resetSelector,
    confirmSelector,
    updateSelector,
  };
}

export const CaptureModelProvider: React.FC<{
  captureModel: CaptureModel;
}> = ({ captureModel: originalCaptureModel, children }) => {
  const [captureModel, setCaptureModel] = useState<CaptureModel>(
    () => originalCaptureModel
  );

  const {
    currentView,
    currentPath,
    pushPath,
    replacePath,
    popPath,
    resetPath,
  } = useInternalStructureState(captureModel);

  const {
    currentFields,
    updateFieldValue,
    createUpdateFieldValue,
    updateInternalFieldValue,
  } = useInternalCurrentFormState(
    captureModel,
    setCaptureModel,
    currentView.type === 'model' ? currentView.fields : null
  );

  const {
    currentSelectorPath,
    confirmSelector,
    currentSelector,
    resetSelector,
    setCurrentSelector,
    updateCustomSelector,
    updateSelector,
  } = useInternalSelectorState(captureModel, updateInternalFieldValue);

  const state: CaptureModelContext = {
    captureModel,
    currentView,
    currentPath,
    pushPath,
    replacePath,
    popPath,
    resetPath,
    currentFields,
    updateFieldValue,
    createUpdateFieldValue,
    currentSelectorPath,
    confirmSelector,
    currentSelector,
    resetSelector,
    setCurrentSelector,
    updateCustomSelector,
    updateSelector,
  };

  return <InternalProvider value={state} children={children} />;
};
