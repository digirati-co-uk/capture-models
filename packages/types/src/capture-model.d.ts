import { BaseField } from './field-types';
import { BaseSelector } from './selector-types';

export type NestedModelFields = [string, ModelFields];

export interface ModelFields extends Array<string | NestedModelFields> {}

export type Revision = {
  id: string;
  label?: string;
  structureId?: string;
  workflowId?: string;
  author?: string[];
  fields: ModelFields;
  approved?: boolean;
  revises?: string;
};

export type CaptureModel = {
  structure: {
    id: string;
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
  );
  document: {
    id: string;
    // @todo future implementation of JSON-LD Extension. Added as optional for now.
    '@context'?: string | ({ [key: string]: string } & { '@vocab'?: string });
    term?: string;
    revision?: string;
    label?: string;
    description?: string;
    type: 'entity';
    selector?: BaseSelector;
    allowMultiple?: boolean;
    properties: {
      [term: string]: Array<BaseField> | Array<CaptureModel['document']>;
    };
  };
  revisions?: Array<Revision>;
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
