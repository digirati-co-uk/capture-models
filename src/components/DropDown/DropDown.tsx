import * as React from 'react';

interface DropDownProps {
  Options: Array<string>;
}

export const DropDown: React.FC<DropDownProps> = ({ Options }) => (
  <select>
    {Options.map(option => (
      <option value={option}>{option}</option>
    ))}
  </select>
);
