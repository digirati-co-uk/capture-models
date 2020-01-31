import { StructureType } from '@capture-models/types';
import generateId from 'nanoid';

export function createChoice(choice: Partial<StructureType<'choice'>> = {}): StructureType<'choice'> {
  return {
    id: generateId(),
    label: choice.label || 'Untitled choice',
    type: 'choice',
    items: [],
    ...choice,
  };
}
