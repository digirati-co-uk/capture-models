import { BackgroundSplash, CardButton, RoundedCard } from '@capture-models/editor';
import { useRefinement } from '@capture-models/plugin-api';
import { BaseField, CaptureModel, EntityRefinement } from '@capture-models/types';
import React from 'react';
import { Breadcrumb } from 'semantic-ui-react';
import { FieldList } from '../FieldList/FieldList';
import { VerboseSelector } from '../VerboseSelector/VerboseSelector';

export const EntityTopLevel: React.FC<{
  title?: string;
  description?: string;
  entity: { property: string; instance: CaptureModel['document'] };
  path: Array<[string, string]>;
  goBack?: () => void;
  showNavigation?: boolean;
  readOnly?: boolean;
  setSelectedField: (field: { property: string; instance: BaseField }) => void;
  setSelectedEntity: (field: { property: string; instance: CaptureModel['document'] }) => void;
  staticBreadcrumbs?: string[];
}> = ({
  title,
  description,
  entity,
  path,
  goBack,
  showNavigation,
  staticBreadcrumbs,
  readOnly,
  setSelectedEntity,
  setSelectedField,
  children,
}) => {
  const refinement = useRefinement<EntityRefinement>('entity', entity, {
    path,
    staticBreadcrumbs,
    readOnly,
  });

  if (refinement) {
    return refinement.refine(
      entity,
      {
        goBack,
        path,
        showNavigation,
        staticBreadcrumbs,
        readOnly,
      },
      children
    );
  }

  const showSelector = entity.instance.selector && (path.length !== 0 || entity.instance.selector.state);

  return (
    <BackgroundSplash
      header={title || entity.instance.label || 'New revision'}
      description={description || entity.instance.description}
    >
      {staticBreadcrumbs ? (
        <RoundedCard size={'small'}>
          <Breadcrumb
            icon="right angle"
            sections={staticBreadcrumbs.map((content, key) => ({ key, content, link: false }))}
          />
        </RoundedCard>
      ) : null}
      {showSelector && entity.instance.selector ? (
        <VerboseSelector
          isTopLevel={path.length === 0}
          readOnly={readOnly || path.length === 0}
          selector={entity.instance.selector}
        />
      ) : null}
      <FieldList
        path={path}
        entity={entity}
        chooseEntity={setSelectedEntity}
        chooseField={setSelectedField}
        readOnly={readOnly}
      />
      {goBack ? <CardButton onClick={goBack}>{readOnly ? 'Go back' : 'Finish and save'}</CardButton> : null}
      {children}
    </BackgroundSplash>
  );
};
