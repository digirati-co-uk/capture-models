import { Heading } from '@capture-models/editor';
import { RoundedCard } from '../RoundedCard/RoundedCard';
import React, { useMemo } from 'react';

type Props = {
  captureModels: Array<{ id: string; label: string }>;
  onDelete: (model: string) => void;
  onClick: (model: string) => void;
};

export const CaptureModelList: React.FC<Props> = ({ captureModels, onClick, onDelete }) => {
  const orderedList = useMemo(() => {
    return captureModels.sort((a, b) => {
      return (a.label || 'Untitled').localeCompare(b.label || 'Untitled');
    });
  }, [captureModels]);

  return (
    <>
      <div style={{ maxWidth: 400 }}>
        {orderedList.map(model => (
          <RoundedCard key={model.id} interactive onClick={() => onClick(model.id)}>
            <Heading size="small">{model.label}</Heading>
          </RoundedCard>
        ))}
      </div>
    </>
  );
};
