import React, { useEffect } from 'react';
import { Button } from '../../atoms/Button';
import { Grid, GridColumn } from '../../atoms/Grid';
import { Card, CardContent, CardHeader, CardMeta } from '../../atoms/Card';
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
      <CardContent>
        <Grid>
          {initialPath.length ? (
            <GridColumn>
              <Button onClick={() => popFocus()}>back</Button>
            </GridColumn>
          ) : null}
          <GridColumn fluid>
            <CardHeader>{choice.label}</CardHeader>
            <CardMeta>Choice</CardMeta>
            <CardHeader>{/*<SubtreeBreadcrumb popSubtree={popSubtree} subtreePath={subtreePath} />*/}</CardHeader>
            {/*{subtree.description ? <Card.Meta>{subtree.description}</Card.Meta> : null}*/}
          </GridColumn>
        </Grid>
      </CardContent>
      <CardContent extra>
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
      </CardContent>
      <CardContent extra>
        <ChoiceList choice={choice} pushFocus={pushFocus} onRemove={onRemove} onReorder={reorderChoices} />
      </CardContent>
      {route === 'list' ? (
        <>
          <CardContent extra>
            <Grid>
              <GridColumn half>
                <Button fluid onClick={router.newChoice}>
                  Add Choice
                </Button>
              </GridColumn>
              <GridColumn half>
                <Button fluid onClick={router.newModel}>
                  Add Model
                </Button>
              </GridColumn>
            </Grid>
          </CardContent>
        </>
      ) : route === 'newChoice' ? (
        <>
          <CardContent>
            <Grid>
              <GridColumn>
                <Button onClick={router.list}>back</Button>
              </GridColumn>
              <GridColumn fluid>
                <CardHeader>Create new choice</CardHeader>
              </GridColumn>
            </Grid>
            <NewChoiceForm
              onSave={newChoice => {
                // Add choice.
                onAddChoice(newChoice);
                // Navigate back.
                router.list();
              }}
            />
          </CardContent>
        </>
      ) : route === 'newModel' ? (
        <>
          <CardContent>
            <Grid>
              <GridColumn>
                <Button onClick={router.list}>back</Button>
              </GridColumn>
              <GridColumn fluid>
                <CardHeader>Create new model</CardHeader>
              </GridColumn>
            </Grid>
            <NewModelForm
              onSave={newModel => {
                // Add model.
                onAddModel(newModel);
                // Navigate back.
                router.list();
              }}
            />
          </CardContent>
        </>
      ) : null}
    </Card>
  );
};
