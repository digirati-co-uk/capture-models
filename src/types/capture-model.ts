import { FieldTypes } from './field-types';
import { SelectorTypes } from './selector-types';
import { NavigationContext } from './navigation';
import { UseCurrentForm } from './current-form';
import { CurrentSelectorState } from './current-selector';

export type NestedModelFields = [string, ModelFields];
export interface ModelFields extends Array<string | NestedModelFields> {}

export type CaptureModel = {
  structure: {
    label: string;
    profile?: string[];
    description?: string;
  } & (
    | {
        type: 'choice';
        items: Array<CaptureModel['structure']>;
      }
    | {
        type: 'model';
        fields: ModelFields;
      }
    | {
        type: 'review';
        fields: ModelFields;
      }
    | {
        //id: string;
        type: 'workflow';
        steps: Array<Exclude<CaptureModel['structure'], StructureType<'workflow'>>>;
      });
  document: {
    '@context'?: string | ({ [key: string]: string } & { '@vocab'?: string });
    term: string;
    label?: string;
    description?: string;
    type: 'entity';
    selector?: SelectorTypes;
    properties: {
      [term: string]: Array<FieldTypes> | Array<CaptureModel['document']>;
    };
  };
  revisions?: Array<{
    id: string;
    workflowId?: string;
    fields: ModelFields;
  }>;
  target?: string[];
  contributors?: {
    [id: string]: {
      id: string;
      type: 'Person' | 'Organization' | 'Software';
      email?: string;
      homepage?: string;
      email_sha1?: string;
      name?: string;
      nickname?: string;
    };
  };
  integrity?: {
    _hash?: string;
  } & {
    [key: string]:
      | {
          _hash?: string;
        }
      | {
          [key: string]: CaptureModel['integrity'];
        };
  };
};

export type StructureType<ChoiceType extends string, T = CaptureModel['structure']> = T extends infer R & {
  type: ChoiceType;
}
  ? T
  : never;

export type UseCaptureModel<Model extends CaptureModel = CaptureModel> = {
  captureModel: Model;
};

export type CaptureModelContext<
  Selector extends SelectorTypes = SelectorTypes,
  Model extends CaptureModel = CaptureModel
> = UseCaptureModel<Model> & NavigationContext<Model> & UseCurrentForm<Model> & CurrentSelectorState<Selector>;
