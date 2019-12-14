// View structure
// 2 columns
// Left side is a tree structure of choices, models and workflows
// Right side is the inspector view
// Input is the capture model
// Input is also onCreateStructure
// Input is also editStructure - or is this integrated?

import { Classes, ITreeNode, Tree } from '@blueprintjs/core';
import produce, { Draft } from 'immer';
import React, { useEffect, useMemo, useState } from 'react';
import { Grid, Label, Segment } from 'semantic-ui-react';
import { structureToTree } from '../../editor/structure-editor';
import { useTreeNode } from '../../hooks/useTreeNode';
import { CaptureModel, StructureType } from '../../types/capture-model';
import { ViewChoice } from '../ViewChoice/ViewChoice';

type Props = {
  structure: CaptureModel['structure'];
};

export const ViewStructure: React.FC<Props> = ({ structure }) => {
  const [selected, setSelected] = useState<CaptureModel['structure'] | null>(null);
  const { nodes, mutatePoint, mutateAllPoints } = useTreeNode(() => [structureToTree(structure) as ITreeNode]);

  const onNodeClick = (node: ITreeNode, path: number[]) => {
    // @todo change this to accept ALL fields in the model.
    // onSave(node.nodeData as string[]);
    setSelected(node.nodeData as CaptureModel['structure']);
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
        {selected ? (
          selected.type === 'choice' ? (
            <ViewChoice onClickChoice={setSelected} choice={selected} onAddChoice={() => console.log('add choice')} />
          ) : (
            <Segment>
              <h1>{selected.label}</h1>
              <Label color={'teal'} attached="top right">
                {selected.type}
              </Label>
            </Segment>
          )
        ) : (
          <Segment placeholder>empty</Segment>
        )}
      </Grid.Column>
    </Grid>
  );
};
