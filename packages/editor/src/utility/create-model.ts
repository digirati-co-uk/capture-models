import { StructureType } from '@capture-models/types';
import { generateId } from './generate-id';

export function createModel(model: Partial<StructureType<'model'>> = {}): StructureType<'model'> {
  return {
    id: generateId(),
    label: model.label || 'Untitled choice',
    type: 'model',
    fields: [],
    ...model,
  };
}
