import React, { useState } from 'react';
import { createChoice } from '../../utility/create-choice';
import { StructureMetadataEditor } from './StructureMetadataEditor';
import { CaptureModel } from '@capture-models/types';

export default { title: 'Components|Edit structure' };

export const EditChoice: React.FC = () => {
  const [choice, setChoice] = useState<CaptureModel['structure']>(
    createChoice({
      label: 'Some choice',
      description: 'With a description',
    })
  );

  return <StructureMetadataEditor onSave={setChoice} structure={choice} />;
};
