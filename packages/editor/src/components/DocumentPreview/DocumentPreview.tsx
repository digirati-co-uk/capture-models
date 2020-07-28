import React, { ComponentClass, FunctionComponent } from 'react';
import { BaseField, CaptureModel } from '@capture-models/types';
import { FieldPreview } from '../FieldPreview/FieldPreview';
import { isEntity } from '@capture-models/helpers';

export const DocumentPreview: React.FC<{
  entity: CaptureModel['document'] | BaseField;
  as?: FunctionComponent<any> | ComponentClass<any> | string;
}> = ({ entity, as, children }) => {
  if (isEntity(entity)) {
    if (entity.labelledBy) {
      if (!entity.properties[entity.labelledBy] || !entity.properties[entity.labelledBy][0]) {
        return <>{children}</>;
      }

      return (
        <>
          {(entity.properties[entity.labelledBy] as any[]).map((m: any) => (
            <DocumentPreview key={m.id} entity={m} />
          ))}
        </>
      );
    }
    return <>{children}</>;
  }

  return <FieldPreview as={as} field={entity} />;
};
