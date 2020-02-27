import React from 'react';
import { FieldHeaderComponent, RoundedCard } from '@capture-models/editor';
import { BaseField, CaptureModel } from '@capture-models/types';
import { isEntityList } from '@capture-models/helpers/lib/is-entity';
import { EntityInstanceList } from '../EntityInstanceList/EntityInstanceList';
import { FieldInstanceList } from '../FieldInstanceList/FieldInstanceList';

export const FieldList: React.FC<{
  document: CaptureModel['document'];
  chooseField: (field: { property: string; instance: BaseField }) => void;
  chooseEntity: (field: { property: string; instance: CaptureModel['document'] }) => void;
}> = ({ document, chooseField, chooseEntity }) => {
  return (
    <RoundedCard>
      {Object.keys(document.properties).map((propertyId, idx) => {
        const instances = document.properties[propertyId];
        if (isEntityList(instances)) {
          const entity = instances[0];
          return (
            <div key={idx}>
              <FieldHeaderComponent label={entity.label || 'Untitled'} />
              <EntityInstanceList entities={instances} property={propertyId} chooseEntity={chooseEntity} />
            </div>
          );
        }
        const field = instances[0];
        return (
          <div key={idx}>
            <FieldHeaderComponent label={field.label} />
            <FieldInstanceList fields={instances} property={propertyId} chooseField={chooseField} />
          </div>
        );
      })}
    </RoundedCard>
  );
};
