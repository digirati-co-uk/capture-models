import {
  CaptureModel,
  ModelFields,
  StructureType,
} from '../types/capture-model';
import { FieldTypes } from '../types/field-types';

// For each of these we should have:
// - Function implementation for changing state
// - Component
//   * Will take in a capture model
//   * Display the UI required to get information out
//   * Callback with data matching function implementation
// - Storybook
//   * Renders component above
//   * Calls the utility (wrapped in `produce()`)
// - Tests

// Utilities
// Get list of capture model fields (tree)
// Capture model field from item to array structure

// Structure
// - label
// - description
// - profile

// Add top-level model
// Add top-level choice
// Add top-level workflow

// Add workflow to choice
// Add model to choice
// Add model to workflow
// Add review to workflow
// Add choice to workflow
// Add choice to choice

// Edit choice details
// Edit model details
// Edit review details
// Edit workflow details

type FlatStructureDefinition =
  | {
      label?: string;
      type: 'model';
      key: string[];
      fields: FlatStructureDefinition[];
    }
  | {
      label?: string;
      type: Exclude<string, 'model'>;
      key: string[];
    };

export function getDocumentFields(
  document: CaptureModel['document'],
  rootKeys: string[] = []
): FlatStructureDefinition {
  const structure: FlatStructureDefinition = {
    label: document.label,
    type: 'model',
    key: rootKeys,
    fields: [],
  };
  for (const key of Object.keys(document.properties)) {
    // @todo validation of values to make sure they are all the same type.
    const values = document.properties[key];
    if (!values || values.length === 0) continue;
    const value = values[0];

    // we have a key.
    structure.fields.push(
      value.type === 'entity'
        ? getDocumentFields(value, [...rootKeys, key])
        : {
            label: value.label,
            type: value.type,
            key: [...rootKeys, key],
          }
    );
  }

  return structure;
}

export function documentFieldOptionsToStructure(
  definitions: FlatStructureDefinition[]
): ModelFields {
  const flatKeys = [];
  for (const def of definitions) {
    flatKeys.push(def.key);
  }

  return mergeFlatKeys(flatKeys);
}

export function structureToFlatStructureDefinition(
  document: CaptureModel['document'],
  modelFields: ModelFields,
  structures: FlatStructureDefinition[] = [],
  keyScope: string[] = []
): FlatStructureDefinition[] {
  modelFields.reduce((acc, field) => {
    if (typeof field === 'string') {
      const fullFieldList = document.properties[field];
      // @todo validation?
      if (!fullFieldList.length) return acc;
      const fullField = fullFieldList[0];
      acc.push({
        key: [...keyScope, field],
        type: fullField.type,
        label: fullField.label,
      });
    }

    const [modelKey, fields] = field as [string, ModelFields];
    const fullFieldList = document.properties[modelKey];
    // @todo validation?
    if (!fullFieldList || !fullFieldList.length) return acc;

    const nestedModel = fullFieldList[0] as CaptureModel['document'];

    // for  [a, [b, c]]
    // We want to get [a, b] and [a, c] extracted
    return structureToFlatStructureDefinition(nestedModel, fields, structures, [
      ...keyScope,
      modelKey,
    ]);
  }, structures);

  return structures;
}

export function mergeFlatKeys(keys: string[][]): ModelFields {
  const array: ModelFields = [];

  const entityBuffer: { key: string; values: string[][] } = {
    key: '',
    values: [],
  };
  const flushBuffer = () => {
    // Flush last.
    if (entityBuffer.key) {
      // flush the buffer.
      array.push([entityBuffer.key, mergeFlatKeys(entityBuffer.values)]);
      // flush the buffer.
      entityBuffer.key = '';
      entityBuffer.values = [];
    }
  };

  for (const key of keys) {
    if (key.length === 0) continue;
    // Flush
    if (entityBuffer.key !== key[0]) {
      flushBuffer();
    }
    // For top level fields.
    if (key.length === 1) {
      array.push(key[0]);
      continue;
    }
    const [entity, ...path] = key;
    entityBuffer.key = entity;
    entityBuffer.values.push(path);
  }
  // Flush last.
  flushBuffer();

  return array;
}

export function createChoice(
  choice: Partial<StructureType<'choice'>>
): StructureType<'choice'> {
  return {
    label: choice.label || 'Untitled choice',
    type: 'choice',
    items: [],
    ...choice,
  };
}

export function createWorkflow(
  workflow: Partial<StructureType<'workflow'>>
): StructureType<'workflow'> {
  return {
    label: workflow.label || 'Untitled workflow',
    type: 'workflow',
    steps: [],
    ...workflow,
  };
}

export function createModel(
  model: Partial<StructureType<'model'>>
): StructureType<'model'> {
  return {
    label: model.label || 'Untitled model',
    type: 'model',
    fields: [],
    ...model,
  };
}

export function createReview(
  review: Partial<StructureType<'review'>>
): StructureType<'review'> {
  return {
    label: review.label || 'Untitled review',
    type: 'review',
    fields: [],
    ...review,
  };
}

export function setTopLevelStructure(
  model: CaptureModel,
  structure: CaptureModel['structure']
): CaptureModel {
  return {
    ...model,
    structure,
  };
}

export function addStructure(
  model: CaptureModel,
  path: number[],
  structure: CaptureModel['structure']
): CaptureModel {
  const { structure: rootStructure, ...doc } = model;

  // @todo use immer in this case.

  return {
    structure: path.reduce((acc: CaptureModel['structure'], next: number) => {
      if (acc.type === 'choice') {
        if (!acc.items[next]) {
          throw new Error('path not found');
        }
        return {
          ...acc,
        };
      }

      return acc;
    }, rootStructure),
    ...doc,
  };
}

export function removeStructure(
  model: CaptureModel,
  path: number[]
): CaptureModel {
  return model;
}

export function getStructureAtPath(
  model: CaptureModel,
  path: number[]
): CaptureModel['structure'] | null {
  return null;
}

export function editStructureDetails(
  model: CaptureModel,
  path: number[],
  structure: Partial<CaptureModel['structure']>
) {
  return model;
}

export function setFieldsOnModel(
  model: CaptureModel,
  path: number[],
  fields: Array<string | [string, Array<string>]>
): CaptureModel {
  return model;
}
