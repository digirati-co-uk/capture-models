import * as React from 'react';
import './Textbox.styles.scss';
import { FieldComponent, TextBoxField } from '../../types/field-types';

export const Textbox: FieldComponent<TextBoxField> = ({
  updateValue,
  children,
}) => <div className="textbox">{children}</div>;
