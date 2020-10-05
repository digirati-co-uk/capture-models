import { CaptureModel } from '../../types/src/capture-model';
import { isEntityList } from './is-entity';

export function serialiseCaptureModel<T = any>(
  model: CaptureModel['document'],
  options: { addMetadata?: boolean } = {},
  metadataAggregate?: { aggregate: any; key: string }
): undefined | T {
  const { addMetadata } = options;
  const properties = Object.keys(model.properties);

  const newDoc = {} as any;
  const metadataAgg = metadataAggregate ? metadataAggregate.aggregate : {};

  if (properties.length === 0) {
    return undefined; // Always return undefined if there are no properties.
  }

  for (const prop of properties) {
    const modelTemplate = model.properties[prop];

    if (modelTemplate.length === 0) {
      // This shouldn't happen with a valid model.
      continue;
    }

    if (isEntityList(modelTemplate)) {
      // We have an entity list.
      if (modelTemplate.length === 1) {
        const serialised = serialiseCaptureModel(
          modelTemplate[0],
          options,
          addMetadata
            ? {
                aggregate: metadataAgg,
                key: metadataAggregate ? `${metadataAggregate.key}.${prop}` : prop,
              }
            : undefined
        );
        if (typeof serialised !== 'undefined') {
          newDoc[prop] = serialised;
        }
        continue;
      }
      newDoc[prop] = modelTemplate
        .map(template =>
          serialiseCaptureModel(
            template,
            options,
            addMetadata
              ? {
                  aggregate: metadataAgg,
                  key: metadataAggregate ? `${metadataAggregate.key}.${prop}` : prop,
                }
              : undefined
          )
        )
        // Filter any undefined documents.
        .filter(doc => typeof doc !== 'undefined');
    } else {
      if (addMetadata) {
        metadataAgg[metadataAggregate && metadataAggregate.key ? `${metadataAggregate.key}.${prop}` : prop] =
          modelTemplate[0].type;
      }
      // When its a single field.
      if (modelTemplate.length === 1) {
        const value = modelTemplate[0].value;
        // Null indicates that no user has edited it as a default from the model.
        if (value !== null && typeof value !== 'undefined') {
          newDoc[prop] = value;
        }
        continue;
      }
      newDoc[prop] = modelTemplate
        .map(template => {
          return template.value;
        })
        .filter(value => value !== null && typeof value !== 'undefined');
    }
  }

  if (addMetadata && !metadataAggregate) {
    newDoc.__meta__ = metadataAgg;
  }

  return newDoc;
}
