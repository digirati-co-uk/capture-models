import React from 'react';
import styled from 'styled-components';
import { BaseField } from '@capture-models/types';
import { FieldPreview } from '../FieldPreview/FieldPreview';

const PreviewListContainer = styled.div`
  & ~ & {
    margin-top: 1.5em;
  }
`;

const PreviewList = styled.div`
  background: rgba(5, 42, 68, 0.1);
  padding: 0.5em;
  border-radius: 3px;
`;

const PreviewLabel = styled.div`
  font-size: 1em;
  font-weight: 600;
  margin-bottom: 0.5em;
`;

export const FieldInstanceReadOnly: React.FC<{
  fields: Array<BaseField>;
}> = ({ fields }) => {
  return (
    <PreviewListContainer>
      <PreviewLabel>{fields[0].label}</PreviewLabel>
      <PreviewList>
        {fields.map(field => (
          <FieldPreview key={field.id} field={field} />
        ))}
      </PreviewList>
    </PreviewListContainer>
  );
};
