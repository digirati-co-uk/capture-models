// Required utilities.
// - generateBlankField
// - generateBlankSelector
// - generateBlankFieldset
// - saveNestedState([path, to, state], newState)
// - context for current selector
// - context for saving selectors
// - context for capture model crud.

// export function generateBlankField<
//   T extends Templates,
//   F extends FieldTypes
// >(captureModel: CaptureModel<T, F>, field: FieldTypes) {
//   // Grab the last field.
//   const last = field.items[field.items.length - 1];
//
//   // If the last field had a template, use it.
//   if (last.template) {
//     return {
//       ...last,
//       ...captureModel.templates[last.template],
//       value: '',
//     };
//   }
//
//   // If the parent field has one, use it.
//   if (field.template) {
//     return {
//       ...last,
//       ...captureModel.templates[field.template],
//       value: '',
//     };
//   }
//
//   if (last.type === 'model') {
//     const fields: typeof last.fields = Object.keys(last.fields).reduce(
//       <T extends keyof typeof last.fields>(acc: any, key: T) => {
//         acc[key] = generateBlankField(captureModel, last.fields[key]);
//         return acc;
//       },
//       {}
//     );
//
//     return {
//       ...last,
//       fields,
//     };
//   }
//   // Otherwise just shallow clone it.
//   return {
//     ...last,
//     value: '',
//   };
// }
//
// export function makeStructure<T extends Templates, F extends FieldMap<keyof T>>(
//   structure: AllStructures<F>,
//   fields: F,
//   templates: T
// ): CaptureModel<T, F> {
//   return { structure, fields, templates };
// }

// Need a list of operation of these capture models.
// Need a defined set of actions to transform data
// Defined model + usability of typescript
// Need to remember that the capture models will not be know at development time
// so "smart" types will be useless. Only benefit will be for creating capture
// models using the types.
