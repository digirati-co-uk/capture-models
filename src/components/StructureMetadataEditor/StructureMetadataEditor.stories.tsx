import React, { useState } from 'react';
import { CaptureModel } from '../../types/capture-model';
import { StructureMetadataEditor } from './StructureMetadataEditor';

export default { title: 'Components|Edit structure' };

export const EditChoice: React.FC = () => {
  const [choice, setChoice] = useState<CaptureModel['structure']>({
    type: 'choice',
    label: 'Some choice',
    description: 'With a description',
    items: [],
  });

  return <StructureMetadataEditor onSave={setChoice} structure={choice} />;
};
