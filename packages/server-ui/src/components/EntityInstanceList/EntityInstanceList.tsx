import { DocumentPreview, RoundedCard } from '@capture-models/editor';
import { isEntity } from '@capture-models/helpers';
import { CaptureModel } from '@capture-models/types';
import React from 'react';

function getLabel(document: CaptureModel['document']) {
  if (
    document.labelledBy &&
    document.properties[document.labelledBy] &&
    document.properties[document.labelledBy].length > 0
  ) {
    const field = document.properties[document.labelledBy][0];
    if (!isEntity(field) && field.value) {
      return field.value;
    }
  }
  return `Field number (type: ${document.type})`;
}

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
            <DocumentPreview entity={field}>{getLabel(field)}</DocumentPreview>
          </RoundedCard>
        );
      })}
    </>
  );
};
