import { FieldPreview, RoundedCard } from '@capture-models/editor';
import { BaseField } from '@capture-models/types';
import React from 'react';

export const FieldInstanceList: React.FC<{
  fields: Array<BaseField>;
  property: string;
  chooseField: (field: { property: string; instance: BaseField }) => void;
}> = ({ fields, chooseField, property }) => {
  return (
    <>
      {fields.map((field, idx) => {
        return (
          <RoundedCard
            key={idx}
            size="small"
            interactive={true}
            onClick={() => chooseField({ instance: field, property })}
          >
            <FieldPreview field={field} />
          </RoundedCard>
        );
      })}
    </>
  );
};
