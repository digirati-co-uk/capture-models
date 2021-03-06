import React from 'react';
import { Grid, GridColumn } from '../../atoms/Grid';
import { ChoiceEditor } from '../ChoiceEditor/ChoiceEditor';
import { ModelEditor } from '../ModelEditor/ModelEditor';
import { CaptureModel, ModelFields, StructureType } from '@capture-models/types';
import { Tree } from '../Tree/Tree';

type Props = {
  tree: any[];
  structure: CaptureModel['structure'];
  currentPath?: number[];
  document: CaptureModel['document'];
  setPath?: (ids: number[]) => void;
  setLabel: (value: string) => void;
  setDescription: (value: string) => void;
  setProfile: (value: string[]) => void;
  setInstructions: (value: string) => void;
  onAddChoice: (choice: StructureType<'choice'>) => void;
  onAddModel: (model: StructureType<'model'>) => void;
  onRemove: (id: number) => void;
  pushFocus: (idx: number) => void;
  setFocus: (idx: number[]) => void;
  popFocus: (payload?: any) => void;
  setModelFields: (fields: ModelFields) => void;
  reorderChoices: (startIndex: number, endIndex: number) => void;
};

export const StructureEditor: React.FC<Props> = ({
  tree,
  document,
  structure,
  setFocus,
  currentPath,
  setDescription,
  setInstructions,
  setLabel,
  setProfile,
  setPath,
  popFocus,
  reorderChoices,
  onRemove,
  pushFocus,
  onAddChoice,
  onAddModel,
  setModelFields,
}) => {
  return (
    <Grid padded>
      <GridColumn>
        <Tree tree={tree[0]} onClick={({ key }) => setFocus(key)} />
      </GridColumn>
      <GridColumn fluid>
        {structure ? (
          structure.type === 'choice' ? (
            <ChoiceEditor
              key={`${structure.label}${structure.type}${structure.description}`}
              choice={structure}
              onAddChoice={onAddChoice}
              onAddModel={onAddModel}
              popFocus={popFocus}
              onRemove={onRemove}
              pushFocus={pushFocus}
              setLabel={setLabel}
              setDescription={setDescription}
              initialPath={currentPath}
              setProfile={setProfile}
              reorderChoices={reorderChoices}
            />
          ) : structure.type === 'model' ? (
            <ModelEditor
              model={structure}
              initialPath={currentPath}
              popFocus={popFocus}
              key={(currentPath || []).map(r => `${r}`).join('-')}
              setLabel={setLabel}
              setDescription={setDescription}
              setInstructions={setInstructions}
              document={document}
              modelFields={structure.fields}
              setModelFields={setModelFields}
            />
          ) : (
            <div>Unknown type</div>
          )
        ) : (
          <div>empty</div>
        )}
      </GridColumn>
    </Grid>
  );
};
