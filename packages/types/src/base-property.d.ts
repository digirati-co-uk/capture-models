import { BaseSelector } from './selector-types';

export interface BaseProperty {
  label: string;
  description?: string;
  authors?: string[];
  term?: string;
  revision?: string;
  labelledBy?: string;
  revises?: string;
  selector?: BaseSelector;
  allowMultiple?: boolean;
  immutable?: boolean;
}
