import React, { useEffect } from 'react';
import { Button, Card, Grid } from 'semantic-ui-react';
import { ChoiceList } from '../ChoiceList/ChoiceList';
import { NewChoiceForm } from '../NewChoiceForm/NewChoiceForm';
import { NewModelForm } from '../NewModelForm/NewModelForm';
import { useMiniRouter } from '../../hooks/useMiniRouter';
import { StructureMetadataEditor } from '../StructureMetadataEditor/StructureMetadataEditor';
import { StructureType } from '@capture-models/types';

type Props = {
  choice: StructureType<'choice'>;
  initialPath?: number[];
  setPath?: (ids: number[]) => void;
  setLabel: (value: string) => void;
  setProfile: (profile: string[]) => void;
  setDescription: (value: string) => void;
  onAddChoice: (choice: StructureType<'choice'>) => void;
  onAddModel: (model: StructureType<'model'>) => void;
  reorderChoices: (startIndex: number, endIndex: number) => void;
  onRemove: (id: number) => void;
  pushFocus: (idx: number) => void;
  popFocus: (payload?: any) => void;
};

export const ChoiceEditor: React.FC<Props> = ({
  choice,
  onAddChoice,
  onAddModel,
  onRemove,
  setLabel,
  setDescription,
  initialPath = [],
  setPath,
  setProfile,
  reorderChoices,
  pushFocus,
  popFocus,
}) => {
  const [route, router] = useMiniRouter(['list', 'newChoice', 'newModel'], 'list');

  useEffect(() => {
    router.list();
  }, [choice, router]);

  if (choice.type !== 'choice') {
    return null;
  }

  return (
    <Card fluid={true}>
      <Card.Content>
        <Grid>
          {initialPath.length ? (
            <Grid.Column width={2}>
              <Button icon="left arrow" onClick={() => popFocus()} />
            </Grid.Column>
          ) : null}
          <Grid.Column width={13}>
            <Card.Header>{choice.label}</Card.Header>
            <Card.Meta>Choice</Card.Meta>
            <Card.Header>{/*<SubtreeBreadcrumb popSubtree={popSubtree} subtreePath={subtreePath} />*/}</Card.Header>
            {/*{subtree.description ? <Card.Meta>{subtree.description}</Card.Meta> : null}*/}
          </Grid.Column>
        </Grid>
      </Card.Content>
      <Card.Content extra>
        <StructureMetadataEditor
          key={`${choice.label}${choice.description}`}
          structure={choice}
          profiles={initialPath.length ? [] : ['tabs']}
          onSave={values => {
            setLabel(values.label);
            setDescription(values.description || '');
            if (values.profile) {
              setProfile(values.profile);
            }
          }}
        />
      </Card.Content>
      <Card.Content extra>
        <ChoiceList choice={choice} pushFocus={pushFocus} onRemove={onRemove} onReorder={reorderChoices} />
      </Card.Content>
      {route === 'list' ? (
        <>
          <Card.Content extra>
            <Grid columns={2}>
              <Grid.Column>
                <Button fluid onClick={router.newChoice}>
                  Add Choice
                </Button>
              </Grid.Column>
              <Grid.Column>
                <Button fluid onClick={router.newModel}>
                  Add Model
                </Button>
              </Grid.Column>
            </Grid>
          </Card.Content>
        </>
      ) : route === 'newChoice' ? (
        <>
          <Card.Content>
            <Grid>
              <Grid.Column width={2}>
                <Button icon="left arrow" onClick={router.list} />
              </Grid.Column>
              <Grid.Column width={13}>
                <Card.Header>Create new choice</Card.Header>
              </Grid.Column>
            </Grid>
            <NewChoiceForm
              onSave={newChoice => {
                // Add choice.
                onAddChoice(newChoice);
                // Navigate back.
                router.list();
              }}
            />
          </Card.Content>
        </>
      ) : route === 'newModel' ? (
        <>
          <Card.Content>
            <Grid>
              <Grid.Column width={2}>
                <Button icon="left arrow" onClick={router.list} />
              </Grid.Column>
              <Grid.Column width={13}>
                <Card.Header>Create new model</Card.Header>
              </Grid.Column>
            </Grid>
            <NewModelForm
              onSave={newModel => {
                // Add model.
                onAddModel(newModel);
                // Navigate back.
                router.list();
              }}
            />
          </Card.Content>
        </>
      ) : null}
    </Card>
  );
};
