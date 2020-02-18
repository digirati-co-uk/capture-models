import { CaptureModel } from '@capture-models/types';
import { Structure } from '../entity/Structure';

export function fromStructure(input: CaptureModel['structure'], rootChoice?: Structure): Structure {
  const structure = new Structure();

  // Set the static mapped fields.
  structure.id = input.id;
  structure.label = input.label;
  structure.profile = input.profile;
  structure.order = 0;
  structure.description = input.description;
  structure.type = input.type;
  structure.flatItems = Promise.resolve([]);

  // This is passed in so that it can be propagated through the tree.
  if (rootChoice) {
    structure.rootChoice = rootChoice;
  }

  if (input.type === 'model') {
    // This is the left of our tree.
    structure.fields = input.fields;
  } else if (input.type === 'choice') {
    // A branch, so we need to traverse through the items.
    structure.items = [];
    let index = 0;
    for (const structureItem of input.items) {
      const item = fromStructure(structureItem, rootChoice ? rootChoice : structure);
      // Set the order.
      item.order = index;
      index++;

      // Set the parent choice.
      item.parentChoice = Promise.resolve(structure);

      // Finally, push onto structure.
      structure.items.push(item);
    }

    // @todo Hoist the flat structures.
    // structure.flatItems.push(...item.flatItems);
    // item.flatItems = [];
  } else {
    // error?
  }

  return structure;
}
