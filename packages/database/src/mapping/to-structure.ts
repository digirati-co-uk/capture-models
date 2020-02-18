import { CaptureModel } from '@capture-models/types';
import { Structure } from '../entity/Structure';

// @todo Now that this is created, can this be done in a Postgres view?
export async function toStructure(structure: Structure, root = true): Promise<CaptureModel['structure']> {
  const baseFields: Partial<CaptureModel['structure']> = {
    id: structure.id,
    type: structure.type as any,
    description: structure.description,
    profile: structure.profile,
    label: structure.label,
  };

  if (structure.type === 'model') {
    if (!baseFields.id) {
      throw new Error('Invalid structure without ID');
    }

    return {
      ...baseFields,
      fields: structure.fields,
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
      // @todo replace this with ID field directly, we don't need to load the whole parent choice.
      //   this will make the structure 2 simple queries (one join if we can get it loading eagerly)
      const parent = await singleStructure.parentChoice;
      if (parent) {
        if (parent.id === structure.id) {
          rootFields[singleStructure.order] = singleStructure;
        } else {
          fieldHashTable[parent.id].items[singleStructure.order] = singleStructure;
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
