import { FieldTypes } from './field-types';
import { SelectorTypes } from './selector-types';

export type CaptureModel = {
  structure: {
    label: string;
    description?: string;
  } & (
    | {
        type: 'choice';
        items: Array<CaptureModel['structure']>;
      }
    | {
        type: 'model';
        fields: Array<string | [string, Array<string>]>;
      });
  document: {
    '@context'?: string | { [key: string]: string };
    conformsTo?: string;
    label?: string;
    description?: string;
    type: 'entity';
    selector?: SelectorTypes;
    properties: {
      [term: string]: Array<FieldTypes> | Array<CaptureModel['document']>;
    };
  };
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
