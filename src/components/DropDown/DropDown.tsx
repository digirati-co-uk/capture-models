import * as React from 'react';
import './DropDown.styles.scss';

interface DropDownProps {
  Options: Array<string>;
  OnChange(value: string): void;
  Selected: string;
}

export const DropDown: React.FC<DropDownProps> = ({
  Options,
  OnChange,
  Selected,
}) => (
  <select
    className="drop-down"
    onChange={e => OnChange(e.target.value)}
    value={Selected}
  >
    {Options.map(option => (
      <option className="down-down__option" value={option} key={option}>
        {option}
      </option>
    ))}
  </select>
);
