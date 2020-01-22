import generateId from 'nanoid';
import { StructureType } from '../types/capture-model';

export function createModel(model: Partial<StructureType<'model'>> = {}): StructureType<'model'> {
  return {
    id: generateId(),
    label: model.label || 'Untitled choice',
    type: 'model',
    fields: [],
    ...model,
  };
}
