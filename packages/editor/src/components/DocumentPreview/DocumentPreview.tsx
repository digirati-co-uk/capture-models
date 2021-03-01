import React, { ComponentClass, FunctionComponent, useMemo } from 'react';
import { BaseField, CaptureModel } from '@capture-models/types';
import { FieldPreview } from '../FieldPreview/FieldPreview';
import { isEntity, filterRevises } from '@capture-models/helpers';

export const DocumentPreview: React.FC<{
  entity: CaptureModel['document'] | BaseField;
  as?: FunctionComponent<any> | ComponentClass<any> | string;
}> = ({ entity, as, children }) => {
  const filteredLabeledBy = useMemo(() => {
    if (isEntity(entity)) {
      if (entity.labelledBy) {
        const properties = filterRevises(entity.properties[entity.labelledBy]);

        if (!properties || properties.length === 0) {
          return undefined;
        }

        return properties as Array<CaptureModel['document'] | BaseField>;
      }
    }

    return undefined;
  }, [entity]);

  if (isEntity(entity)) {
    if (!filteredLabeledBy) {
      return <>{children}</>;
    }

    return (
      <>
        {filteredLabeledBy.map(labelFieldOrEntity => (
          <DocumentPreview key={labelFieldOrEntity.id} entity={labelFieldOrEntity} />
        ))}
      </>
    );
  }

  return <FieldPreview as={as} field={entity} />;
};
