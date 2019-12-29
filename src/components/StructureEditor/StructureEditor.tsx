import { ITreeNode, Tree } from '@blueprintjs/core';
import React, { useEffect } from 'react';
import { Grid, Segment } from 'semantic-ui-react';
import { useTreeNode } from '../../hooks/useTreeNode';
import { CaptureModel, ModelFields, StructureType } from '../../types/capture-model';
import { ChoiceEditor } from '../ChoiceEditor/ChoiceEditor';
import { ModelEditor } from '../ModelEditor/ModelEditor';

type Props = {
  tree: ITreeNode[];
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
  const { nodes, mutatePoint, setNodes } = useTreeNode(() => tree);

  useEffect(() => {
    setNodes(tree);
  }, [setNodes, tree]);

  const onNodeClick = (node: ITreeNode, [_, ...path]: number[]) => {
    setFocus(path);
  };

  const handleNodeExpand = (_: any, path: number[]) => {
    mutatePoint(path, node => {
      node.isExpanded = true;
    });
  };

  const handleNodeCollapse = (_: any, path: number[]) => {
    mutatePoint(path, node => {
      node.isExpanded = false;
    });
  };

  return (
    <Grid padded>
      <Grid.Column width={6}>
        <Tree
          contents={nodes}
          onNodeClick={onNodeClick}
          onNodeCollapse={handleNodeCollapse}
          onNodeExpand={handleNodeExpand}
        />
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
