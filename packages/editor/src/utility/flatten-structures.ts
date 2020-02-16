import { CaptureModel, StructureType } from '@capture-models/types';

export function flattenStructures(structure: CaptureModel['structure']): Array<StructureType<'model'>> {
  const flatStructures: Array<StructureType<'model'>> = [];

  if (structure.type === 'model') {
    flatStructures.push(structure);
  } else if (structure.type === 'choice') {
    // Only support choices and models.
    for (const choice of structure.items) {
      flatStructures.push(...flattenStructures(choice));
    }
  }

  return flatStructures;
}
