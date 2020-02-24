import { CaptureModel } from '@capture-models/types';

export function traverseStructure(
  structure: CaptureModel['structure'],
  onStructure: (structure: CaptureModel['structure'], path: string[]) => boolean | void,
  path: string[] = [structure.id]
) {
  if (structure.type === 'choice') {
    for (const item of structure.items) {
      if (traverseStructure(item, onStructure, [...path, structure.id, item.id]) === true) {
        return;
      }
    }
  }
  return onStructure(structure, path);
}
