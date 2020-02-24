import { isEntityList } from '@capture-models/editor';
import { CaptureModel } from '@capture-models/types';
import { forkDocument } from './create-revision-document';
import { formPropertyValue } from './fork-field';

export function hydratePartialDocument(
  partialDocument: CaptureModel['document'],
  wholeDocument: CaptureModel['document'],
  options: { keepValues?: boolean; markAsImmutable?: boolean } = {}
): CaptureModel['document'] {
  const { keepValues = false, markAsImmutable = false } = options;

  // Documents have properties.
  for (const term of Object.keys(wholeDocument.properties)) {
    // The revised document may not have this property.
    if (!partialDocument.properties[term]) {
      const propertyValues = wholeDocument.properties[term];
      if (!propertyValues.length) {
        // this may be invalid, won't be added.
        continue;
      }
      if (isEntityList(propertyValues)) {
        // We need to fork the first entity.
        const forkedDocument = forkDocument(propertyValues[0], {
          removeDefaultValues: !keepValues,
          removeValues: !keepValues,
          // @todo set immutable here for document.
        });
        // Set on our new partial.
        partialDocument.properties[term] = [
          formPropertyValue(forkedDocument, {
            clone: false,
            // @todo set immutable here for field.
          }),
        ];
      } else {
        const forkedField = propertyValues[0];
        // We need to fork first value.
        partialDocument.properties[term] = [
          formPropertyValue(forkedField, {
            forkValue: keepValues,
            clone: true,
            // @todo set immutable here for field.
          }),
        ];
      }
    } else {
      const wholeValues = wholeDocument.properties[term];
      const partialValues = partialDocument.properties[term];
      if (isEntityList(wholeValues) !== isEntityList(partialValues)) {
        throw new Error(`Mismatch in documents type at ${term}`);
      }
      if (!wholeValues[0]) {
        throw new Error(`Invalid whole document at ${term}, missing value`);
      }
      if (isEntityList(wholeValues) && isEntityList(partialValues)) {
        // recurse.
        partialDocument.properties[term] = partialValues.map(doc => {
          return hydratePartialDocument(doc, wholeValues[0], options);
        });
      } else {
        // Do nothing, this is a value.
      }
    }
  }

  return partialDocument;
}
