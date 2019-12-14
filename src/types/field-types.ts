import React from 'react';
import { SelectorTypes } from './selector-types';
import { CaptureModel } from './capture-model';

export type BaseField = {
  term: string;
  label: string;
  description?: string;
  selector?: SelectorTypes;
  creator?: string[];
};

export type MapValues<T, Base = {}> = T extends { [K in keyof T]: infer U } ? Base & U : never;

export interface FieldTypeMap {}

export type FieldTypes = MapValues<FieldTypeMap, BaseField>;

export type InjectedFieldProps<ValueType> = {
  updateValue: (value: ValueType) => void;
};

// Injected properties.
export type FieldTypeProps<T extends { value: Value }, Value = T['value']> = T & InjectedFieldProps<T['value']>;

export type FieldComponent<T extends { value: Value }, Value = T['value']> = React.FC<FieldTypeProps<T, Value>>;

export type FieldSpecification<T extends FieldTypeMap[Type], Type extends keyof FieldTypeMap> = {
  label: string;
  type: T['type'];
  description: string;
  defaultValue: T['value'];
  Component: React.FC<T & InjectedFieldProps<T['value']>>;
  Editor: React.FC<Required<Omit<T, 'value'>>>;
};

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
