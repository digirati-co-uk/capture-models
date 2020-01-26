import { CaptureModel } from '../types/capture-model';

export function traverseStructure(
  structure: CaptureModel['structure'],
  onStructure: (structure: CaptureModel['structure'], path: string[]) => void,
  path: string[] = [structure.id]
) {
  if (structure.type === 'choice') {
    structure.items.forEach(item => traverseStructure(item, onStructure, [...path, structure.id, item.id]));
  }
  onStructure(structure, path);
}
