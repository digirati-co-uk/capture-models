import { Classes, ITreeNode, Tag, Tree } from '@blueprintjs/core';
import produce, { Draft } from 'immer';
import React, { useState } from 'react';
import { CaptureModel } from '../../types/capture-model';

type Props = {
  document: CaptureModel['document'];
  selected: string[][];
  onSave: (newFields: string[]) => void;
};

export const SelectModelFields: React.FC<Props> = ({ document, selected = [], onSave }) => {
  const processDoc = (doc: CaptureModel['document'], keyAcc: string[]): ITreeNode[] => {
    const idx = selected.map(s => s.join('--HASH--'));
    return Object.keys(doc.properties)
      .map(key => {
        const props = doc.properties[key];
        if (props.length === 0) return null;
        const prop = props[0];
        if (!prop) return null;
        if (prop.type === 'entity') {
          return {
            id: 0,
            hasCaret: true,
            icon: 'layers',
            label: prop.label,
            nodeData: [...keyAcc, key],
            secondaryLabel: <Tag intent="warning">entity</Tag>,
            childNodes: processDoc(prop as CaptureModel['document'], [...keyAcc, key]),
          };
        }
        return {
          id: key,
          icon: 'cube',
          label: prop.label,
          secondaryLabel: <Tag intent="primary">{prop.type}</Tag>,
          disabled: idx.indexOf([...keyAcc, key].join('--HASH--')) !== -1,
          nodeData: [...keyAcc, key],
        };
      })
      .filter(Boolean) as ITreeNode[];
  };

  const [nodes, setNodes] = useState<ITreeNode[]>(() => processDoc(document, []));

  const mutatePoint = ([i, ...path]: number[], mutation: (node: Draft<ITreeNode>) => void) => {
    setNodes(
      produce(nodesDraft => {
        mutation(
          path.reduce((acc: ITreeNode, next: number) => {
            if (!acc.childNodes) return acc;
            return acc.childNodes[next];
          }, nodesDraft[i])
        );
      })(nodes)
    );
  };

  const onNodeClick = (node: ITreeNode) => {
    if (!node.childNodes) {
      // @todo change this to accept ALL fields in the model.
      onSave(node.nodeData as string[]);
    }
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
    <Tree
      contents={nodes}
      onNodeClick={onNodeClick}
      onNodeCollapse={handleNodeCollapse}
      onNodeExpand={handleNodeExpand}
      className={Classes.ELEVATION_1}
    />
  );
};
