import React, { useState } from 'react';
import { CaptureModel } from '../../types/capture-model';
import { createChoice } from '../../utility/create-choice';
import { StructureMetadataEditor } from './StructureMetadataEditor';

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
