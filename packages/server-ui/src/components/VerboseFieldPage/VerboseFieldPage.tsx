import {
  BackgroundSplash,
  CardButton,
  FieldWrapper,
  Revisions,
  RoundedCard,
  useFieldSelector,
} from '@capture-models/editor';
import { BaseField } from '@capture-models/types';
import React, { useState } from 'react';

export const VerboseFieldPage: React.FC<{
  field: { property: string; instance: BaseField };
  path: Array<[string, string]>;
  goBack: () => void;
}> = ({ field, path, goBack }) => {
  const [value, setValue] = useState(field.instance.value);
  const updateFieldValue = Revisions.useStoreActions(a => a.updateFieldValue);
  const selector = useFieldSelector(field.instance);

  return (
    <BackgroundSplash header={field.instance.label}>
      <RoundedCard size="small">
        <FieldWrapper field={field.instance} selector={selector} onUpdateValue={setValue} />
      </RoundedCard>
      <CardButton
        onClick={() => {
          updateFieldValue({ path, value });
          goBack();
        }}
      >
        Finish and save
      </CardButton>
    </BackgroundSplash>
  );
};
