import generateId from 'nanoid';
import { StructureType } from '../types/capture-model';

export function createChoice(choice: Partial<StructureType<'choice'>> = {}): StructureType<'choice'> {
  return {
    id: generateId(),
    label: choice.label || 'Untitled choice',
    type: 'choice',
    items: [],
    ...choice,
  };
}
