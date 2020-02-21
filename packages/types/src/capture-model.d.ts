import { BaseField } from './field-types';
import { BaseSelector } from './selector-types';

export type NestedModelFields = [string, ModelFields];

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ModelFields extends Array<string | NestedModelFields> {}

export type Revision = {
  id: string;
  label?: string;
  status?: StatusTypes;
  structureId?: string;
  workflowId?: string;
  authors?: string[];
  fields: ModelFields;
  approved?: boolean;
  revises?: string;
};

export type StatusTypes = 'draft' | 'submitted' | 'accepted';

export type Target = {
  id: string;
  type: string;
};

export type Contributor = {
  id: string;
  type: 'Person' | 'Organization' | 'Software';
  email?: string;
  homepage?: string;
  email_sha1?: string;
  name?: string;
  nickname?: string;
};

export type CaptureModel = {
  id?: string;
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
    labelledBy?: string;
    label?: string;
    description?: string;
    authors?: string[];
    type: 'entity';
    selector?: BaseSelector;
    allowMultiple?: boolean;
    properties: {
      [term: string]: Array<BaseField> | Array<CaptureModel['document']>;
    };
  };
  revisions?: Array<Revision>;
  target?: Array<Target>;
  contributors?: {
    [id: string]: Contributor;
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
