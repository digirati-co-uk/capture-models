import React from 'react';
import { Button, Icon, Label, List } from 'semantic-ui-react';
import { StructureType } from '@capture-models/types';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

type Props = {
  choice: StructureType<'choice'>;
  pushFocus: (key: number) => void;
  onRemove: (key: number) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
};

export const ChoiceList: React.FC<Props> = ({ onRemove, choice, onReorder, pushFocus }) => {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    onReorder(result.source.index, result.destination.index);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {provided => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <List relaxed selection size="large">
              {choice.items.map((item, key) => (
                <Draggable key={item.id} draggableId={item.id} index={key}>
                  {innerProvided => (
                    <div
                      className="item"
                      ref={innerProvided.innerRef}
                      {...innerProvided.draggableProps}
                      {...innerProvided.dragHandleProps}
                      onClick={() => {
                        pushFocus(key);
                      }}
                    >
                      <List.Content floated="right">
                        <Button
                          color="red"
                          basic
                          size="mini"
                          onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Remove the current item.
                            onRemove(key);
                          }}
                        >
                          Remove
                        </Button>
                        <Label>{item.type}</Label>
                      </List.Content>
                      <Icon name={item.type === 'model' ? 'tasks' : 'folder'} />
                      <List.Content>
                        <List.Header>{item.label}</List.Header>
                        {item.description ? <List.Description>{item.description}</List.Description> : null}
                      </List.Content>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
