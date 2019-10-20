import { SelectorTypes } from './selector-types';
import { CaptureModel } from './capture-model';

export type TextBoxField = {
  type: 'text-box';
  value: string;
};

export type TextAreaField = {
  type: 'text-area';
  value: string;
};

export type StarRatingField = {
  type: 'star-rating';
  max: number;
  value: number | null;
};

export type CurrentDateField = {
  type: 'current-date';
  format: string;
  value: string | null;
};

export type ViafLookup = {
  type: 'viaf-lookup';
  'viaf-nametype': string;
  value: {
    '@id': string;
    label: string;
  } | null;
};

export type FieldTypes = {
  term: string;
  label?: string;
  description?: string;
  selector?: SelectorTypes;
  creator?: string[];
} & (
  | TextBoxField
  | TextAreaField
  | StarRatingField
  | CurrentDateField
  | ViafLookup);

export type NestedField<Doc extends CaptureModel['document']> = Array<
  | Array<FieldTypes>
  | Array<
      CaptureModel['document'] & {
        fields: NestedField<CaptureModel['document']>;
      }
    >
>;
