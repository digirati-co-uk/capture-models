import { BackgroundSplash, RoundedCard } from '@capture-models/editor';
import { StructureType } from '@capture-models/types';
import React from 'react';

export const Choice: React.FC<{
  showBackButton: boolean;
  onBackButton: () => void;
  onChoice: (id: string) => void;
  choice: StructureType<'choice'>;
}> = ({ choice, onChoice, showBackButton, onBackButton }) => {
  return (
    <>
      <h1>Choice page.</h1>
      {showBackButton ? <button onClick={onBackButton}>back</button> : null}
      <BackgroundSplash header={choice.label} description={choice.description}>
        {choice.items.map((item, idx) => (
          <RoundedCard key={idx} label={item.label} interactive onClick={() => onChoice(item.id)}>
            {item.description}
          </RoundedCard>
        ))}
      </BackgroundSplash>
    </>
  );
};
