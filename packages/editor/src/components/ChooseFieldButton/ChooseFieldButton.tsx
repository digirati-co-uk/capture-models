import React, { useContext, useState } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { DropdownItemProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownItem';
import { PluginContext } from '@capture-models/plugin-api';

type Props = {
  onChange: (term: string) => void;
  fieldType?: string;
};

// - Choose type select
// - Choose label
// - Choose term / JSON property

export const ChooseFieldButton: React.FC<Props> = ({ onChange, fieldType }) => {
  const { fields } = useContext(PluginContext);
  const [value, setValue] = useState(fieldType);

  return (
    <Dropdown
      placeholder="Select input"
      fluid
      selection
      value={value}
      onChange={(_, ev) => {
        onChange(ev.value as string);
        setValue(ev.value as string);
      }}
      options={
        Object.values(fields)
          .map(field =>
            field
              ? {
                  key: field.type,
                  value: field.type,
                  text: field.label,
                  label: field.type,
                }
              : null
          )
          .filter(e => e !== null) as DropdownItemProps[]
      }
    />
  );
};
