import React, { useMemo, useState } from 'react';
import { Button, Card, Divider, Icon, Label, List, Transition } from 'semantic-ui-react';
import { CaptureModel, StructureType } from '../../types/capture-model';
import { StructureMetadataEditor } from '../StructureMetadataEditor/StructureMetadataEditor';

type Props = {
  choice: StructureType<'choice'>;
  initialPath?: number[];
  onAddChoice: () => void;
  onClickChoice: (choice: CaptureModel['structure']) => void;
};

export const ViewChoice: React.FC<Props> = ({ choice, onAddChoice, onClickChoice, initialPath = [] }) => {
  const [selected, setSelected] = useState(initialPath);

  return (
    <Card fluid={true}>
      <Card.Content>
        <Card.Header>{choice.label}</Card.Header>
        <Card.Meta>Choice</Card.Meta>
        <Divider />
        <StructureMetadataEditor structure={choice} onSave={values => console.log(values)} />
      </Card.Content>
      <Card.Content extra>
        <List relaxed selection size="large">
          {choice.items.map((item, key) => (
            <List.Item onClick={() => setSelected(s => [...s, key])}>
              <List.Content floated="right">
                <Label>{item.type}</Label>
              </List.Content>
              <Icon name={item.type === 'model' ? 'tasks' : 'folder'} />
              <List.Content>
                <List.Header>{item.label}</List.Header>
                {item.description ? <List.Description>{item.description}</List.Description> : null}
              </List.Content>
            </List.Item>
          ))}
        </List>
        <Button onClick={onAddChoice} fluid={true}>
          Add new choice
        </Button>
      </Card.Content>
    </Card>
  );
};
