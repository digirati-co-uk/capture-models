import React from 'react';
import { SelectorTypes } from './selector-types';
import { CaptureModel } from './capture-model';

export type BaseField = {
  term: string;
  label?: string;
  description?: string;
  selector?: SelectorTypes;
  creator?: string[];
};

export type TextBoxField = BaseField & {
  type: 'text-box';
  value: string;
};

export type TextAreaField = BaseField & {
  type: 'text-area';
  value: string;
};

export type StarRatingField = BaseField & {
  type: 'star-rating';
  max: number;
  value: number | null;
};

export type CurrentDateField = BaseField & {
  type: 'current-date';
  format: string;
  value: string | null;
};

export type ViafLookup = BaseField & {
  type: 'viaf-lookup';
  'viaf-nametype': string;
  value: {
    '@id': string;
    label: string;
  } | null;
};

export type FieldTypes =
  | TextBoxField
  | TextAreaField
  | StarRatingField
  | CurrentDateField
  | ViafLookup;

export type FieldTypeProps<T extends FieldTypes> = T & {
  updateValue: (value: T['value']) => void;
};

export type FieldComponent<T extends FieldTypes> = React.FC<FieldTypeProps<T>>;

export type NestedField<Doc extends CaptureModel['document']> = Array<
  | { type: 'fields'; list: Array<FieldTypes> }
  | {
      type: 'documents';
      list: Array<
        CaptureModel['document'] & {
          fields: NestedField<CaptureModel['document']>;
        }
      >;
    }
>;
