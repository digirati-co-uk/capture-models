import { CaptureModel } from '@capture-models/types';
import { Structure } from '../entity/Structure';

// @todo Now that this is created, can this be done in a Postgres view?
export async function toStructure(structure: Structure, root = true): Promise<CaptureModel['structure']> {
  const baseFields: Partial<CaptureModel['structure']> = {
    id: structure.id,
    type: structure.type as any,
    description: structure.description ? structure.description : undefined,
    profile: structure.profile ? structure.profile : undefined,
    label: structure.label,
  };

  if (structure.type === 'model') {
    if (!baseFields.id) {
      throw new Error('Invalid structure without ID');
    }

    return {
      ...baseFields,
      fields: structure.fields ? structure.fields : undefined,
      modelRoot: structure.modelRoot ? structure.modelRoot : undefined,
      instructions: structure.instructions ? structure.instructions : undefined,
      forkValues: structure.forkValues ? structure.forkValues : undefined,
      editableAboveRoot: structure.editableAboveRoot ? structure.editableAboveRoot : undefined,
      preventAdditionsAdjacentToRoot: structure.preventAdditionsAdjacentToRoot
        ? structure.preventAdditionsAdjacentToRoot
        : undefined,
    } as CaptureModel['structure'];
  }

  if (root) {
    const resolvedFlatFields = await structure.flatItems;
    const fieldHashTable: { [key: string]: Structure } = Object.create(null);
    const rootFields: Structure[] = [];

    // Throw the fields in a hash map
    for (let i = 0; i < resolvedFlatFields.length; i++) {
      fieldHashTable[resolvedFlatFields[i].id] = resolvedFlatFields[i];
    }

    // Go back through the hash map to build the tree
    for (let i = 0; i < resolvedFlatFields.length; i++) {
      const singleStructure = fieldHashTable[resolvedFlatFields[i].id];
      const parentId = singleStructure.parentChoiceId;
      if (parentId) {
        if (parentId === structure.id) {
          rootFields[singleStructure.order] = singleStructure;
        } else {
          fieldHashTable[parentId].items = fieldHashTable[parentId].items ? fieldHashTable[parentId].items : [];
          fieldHashTable[parentId].items[singleStructure.order] = singleStructure;
        }
      }
    }

    // Now we have all of the individual structure levels linked we can recurse through
    // mapping back to original structure model.
    return {
      ...baseFields,
      items: await Promise.all(rootFields.map(field => toStructure(field, false))),
    } as CaptureModel['structure'];
  }

  // Only the `root` needs to map the fields. At this point `structure.items` has been populated.
  return {
    ...baseFields,
    items: await Promise.all(structure.items.map(field => toStructure(field, false))),
  } as CaptureModel['structure'];
}
