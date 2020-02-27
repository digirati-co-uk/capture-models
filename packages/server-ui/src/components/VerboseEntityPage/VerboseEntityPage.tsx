import { BackgroundSplash, CardButton } from '@capture-models/editor';
import { BaseField, CaptureModel } from '@capture-models/types';
import React, { useState } from 'react';
import { FieldList } from '../FieldList/FieldList';
import { VerboseFieldPage } from '../VerboseFieldPage/VerboseFieldPage';

export const VerboseEntityPage: React.FC<{
  entity: { property: string; instance: CaptureModel['document'] };
  path: Array<[string, string]>;
  goBack: () => void;
}> = ({ entity, path, goBack }) => {
  const [selectedField, setSelectedField] = useState<{ property: string; instance: BaseField }>();
  const [selectedEntity, setSelectedEntity] = useState<{ property: string; instance: CaptureModel['document'] }>();

  if (selectedField) {
    return (
      <VerboseFieldPage
        field={selectedField}
        path={[...path, [selectedField.property, selectedField.instance.id]]}
        goBack={() => setSelectedField(undefined)}
      />
    );
  }

  if (selectedEntity) {
    return (
      <VerboseEntityPage
        entity={selectedEntity}
        path={[...path, [selectedEntity.property, selectedEntity.instance.id]]}
        goBack={() => setSelectedEntity(undefined)}
      />
    );
  }

  return (
    <BackgroundSplash header={entity.instance.label || 'New revision'}>
      <FieldList document={entity.instance} chooseEntity={setSelectedEntity} chooseField={setSelectedField} />
      <CardButton onClick={() => goBack()}>Finish and save</CardButton>
    </BackgroundSplash>
  );
};
