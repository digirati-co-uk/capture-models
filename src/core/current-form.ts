import { UseCurrentForm } from '../types/current-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CaptureModel } from '../types/capture-model';
import produce, { Draft, original } from 'immer';
import { FieldTypes, NestedField } from '../types/field-types';
import { useContext } from './context';

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

const createFormFieldReducer = <Doc extends CaptureModel['document']>(
  document: Doc
) => (acc: NestedField<Doc>, next: string | [string, string[]]) => {
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
      fields: fields.reduce(createFormFieldReducer(singleDoc), []),
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
        currentFieldIds.reduce(
          createFormFieldReducer(captureModel.document),
          []
        )
      );
    }
  }, [captureModel, captureModel.document, currentFieldIds]);

  const fieldValueProducer = useCallback(
    (
      model: Model,
      path: Array<[string, number]>,
      cb: (field: Draft<FieldTypes>, draft: Draft<CaptureModel>) => void
    ) => {
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
        })(model)
      );
    },
    // @todo updateCaptureModel is from a useState call, and is usually excluded from
    //   this deps array. In here it is passed in, which is bad. This could be made
    //   better.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const updateInternalFieldValue = useCallback(
    (
      path: Array<[string, number]>,
      cb: (field: Draft<FieldTypes>, draft: Draft<CaptureModel>) => void
    ) => {
      if (currentFieldIds === null) {
        throw new Error('No form selected');
      }
      fieldValueProducer(captureModel, path, cb);
    },
    [captureModel, currentFieldIds, fieldValueProducer]
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
