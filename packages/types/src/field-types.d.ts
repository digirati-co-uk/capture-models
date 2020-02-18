import { FC } from 'react';
import { CaptureModel } from './capture-model';
import { FieldTypeMap } from './custom';
import { AnyIfEmpty, MapValues } from './utility';
import { BaseSelector } from './selector-types';

export type BaseField = {
  id: string;
  // @todo re-enable when creating JSON-LD extension
  // term: string;
  type: Exclude<string, 'entity'>;
  label: string;
  description?: string;
  selector?: BaseSelector;
  allowMultiple?: boolean;
  creator?: string[];
  revision?: string;
  value: any;
};

export type FieldTypes<Type extends FieldTypeMap = FieldTypeMap> = MapValues<Type>;

export type InjectedFieldProps<ValueType> = {
  updateValue: (value: ValueType) => void;
};
// Injected properties.
export type FieldTypeProps<T extends { value: Value }, Value = T['value']> = T & InjectedFieldProps<T['value']>;
export type FieldSpecification<Props extends BaseField = BaseField> = {
  label: string;
  type: string;
  description: string;
  defaultValue: Props['value'];
  allowMultiple: boolean;
  defaultProps: Partial<Props>;
  Component: FC<Props & InjectedFieldProps<Props['value']>>;
  TextPreview: FC<Props>;
  Editor: FC<Required<Omit<Props, 'value', 'selector'>> & Pick<Props, 'selector'>>;
};

export type NestedField<Doc extends CaptureModel['document']> = Array<
  | { type: 'fields'; list: Array<BaseField> }
  | {
      type: 'documents';
      list: Array<
        CaptureModel['document'] & {
          fields: NestedField<CaptureModel['document']>;
        }
      >;
    }
>;
export type FieldComponent<T extends { value: Value }, Value = T['value']> = FC<FieldTypeProps<T, Value>>;
