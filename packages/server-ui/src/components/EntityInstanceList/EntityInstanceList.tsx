import { DocumentPreview, RoundedCard } from '@capture-models/editor';
import { CaptureModel } from '@capture-models/types';
import React from 'react';

export const EntityInstanceList: React.FC<{
  entities: Array<CaptureModel['document']>;
  property: string;
  chooseEntity: (field: { property: string; instance: CaptureModel['document'] }) => void;
}> = ({ entities, chooseEntity, property }) => {
  return (
    <>
      {entities.map((field, idx) => {
        return (
          <RoundedCard key={idx} interactive={true} onClick={() => chooseEntity({ instance: field, property })}>
            <DocumentPreview entity={field}>
              Field number {idx} (type: {field.type})
            </DocumentPreview>
          </RoundedCard>
        );
      })}
    </>
  );
};
