import React from 'react';
import { CaptureModel } from './capture-model';
import { BaseField } from './field-types';

export type RefinementSupportProps = {
  path: Array<[string, string]>;
  readOnly?: boolean;
};

export type RefinementComponentProps = RefinementSupportProps & {
  goBack?: (newPath?: Array<[string, string]>) => void;
  showNavigation?: boolean;
};

export type RefinementContext<Ref> = Ref extends Refinement<any, any, infer T, any> ? T : never;
export type RefinementType<Ref> = Ref extends Refinement<any, infer T, any, any> ? T : never;
export type RefinementActions<Ref> = Ref extends Refinement<any, any, any, infer T> ? T : never;

export type Refinement<Type, Subject, Context = {}, Actions = {}> = {
  name: string;
  type: Type;
  supports: (subject: { instance: Subject; property: string }, context: RefinementSupportProps & Context) => boolean;
  refine: (
    subject: { instance: Subject; property: string },
    context: RefinementComponentProps & Context & Actions,
    children?: any
  ) => React.ReactElement | null;
};

export type EntityRefinement = Refinement<'entity', CaptureModel['document'], { staticBreadcrumbs?: string[] }>;

export type EntityListRefinement = Refinement<'entity-list', CaptureModel['document'][]>;

export type EntityInstanceListRefinement = Refinement<
  'entity-instance-list',
  CaptureModel['document'][],
  {},
  {
    chooseEntity: (field: { property: string; instance: CaptureModel['document'] }) => void;
  }
>;

export type FieldRefinement = Refinement<'field', BaseField>;

export type FieldListRefinement = Refinement<
  'field-list',
  CaptureModel['document'],
  {},
  {
    chooseField: (field: { property: string; instance: BaseField }) => void;
    chooseEntity: (field: { property: string; instance: CaptureModel['document'] }) => void;
  }
>;

export type FieldInstanceListRefinement = Refinement<
  'field-instance-list',
  BaseField[],
  {},
  {
    chooseField: (field: { property: string; instance: BaseField }) => void;
  }
>;

export type UnknownRefinement =
  | EntityRefinement
  | EntityListRefinement
  | FieldRefinement
  | FieldListRefinement
  | EntityInstanceListRefinement
  | FieldInstanceListRefinement;
