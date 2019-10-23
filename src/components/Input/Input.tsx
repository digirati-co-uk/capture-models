import * as React from 'react';
import './Input.styles.scss';

interface InputProps {
  ChangeHandler: React.ChangeEventHandler<HTMLInputElement>;
  InputType: string;
  DefaultValue?: string | number | string[] | undefined;
  Required?: boolean;
  Disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({
  ChangeHandler,
  InputType,
  DefaultValue,
  Required = false,
  Disabled = false,
}) => {
  return (
    <input
      type={InputType}
      onChange={(e: any) => ChangeHandler(e.target.value)}
      defaultValue={DefaultValue}
      required={Required}
      disabled={Disabled}
    />
  );
};
