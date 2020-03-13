import React from 'react';
import { Grid, Segment } from 'semantic-ui-react';
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
  onAddChoice: (choice: StructureType<'choice'>) => void;
  onAddModel: (model: StructureType<'model'>) => void;
  onRemove: (id: number) => void;
  pushFocus: (idx: number) => void;
  setFocus: (idx: number[]) => void;
  popFocus: (payload?: any) => void;
  setModelFields: (fields: ModelFields) => void;
};

export const StructureEditor: React.FC<Props> = ({
  tree,
  document,
  structure,
  setFocus,
  currentPath,
  setDescription,
  setLabel,
  setPath,
  popFocus,
  onRemove,
  pushFocus,
  onAddChoice,
  onAddModel,
  setModelFields,
}) => {
  console.log(tree);
  return (
    <Grid padded>
      <Grid.Column width={6}>
        <Tree tree={tree[0]} onClick={({ key }) => setFocus(key)} />
      </Grid.Column>
      <Grid.Column width={10}>
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
            />
          ) : structure.type === 'model' ? (
            <ModelEditor
              model={structure}
              initialPath={currentPath}
              popFocus={popFocus}
              key={(currentPath || []).map(r => `${r}`).join('-')}
              setLabel={setLabel}
              setDescription={setDescription}
              document={document}
              modelFields={structure.fields}
              setModelFields={setModelFields}
            />
          ) : (
            <div>Unknown type</div>
          )
        ) : (
          <Segment placeholder>empty</Segment>
        )}
      </Grid.Column>
    </Grid>
  );
};
