import React, { useContext, useState } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { DropdownItemProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownItem';
import { PluginContext } from '../../core/plugins';

// Pull in the build-in selectors.
import '../../selector-types/BoxSelector';

type Props = {
  value?: string;
  onChange: (term: string) => void;
};

export const ChooseSelectorButton: React.FC<Props> = ({ value: initialValue, onChange }) => {
  const { selectors } = useContext(PluginContext);
  const [value, setValue] = useState(initialValue);

  return (
    <div>
      <Dropdown
        placeholder="Choose a selector"
        fluid
        selection
        value={value}
        onChange={(_, ev) => {
          onChange(ev.value as string);
          setValue(ev.value as string);
        }}
        options={[
          {
            key: '',
            value: '',
            text: 'none',
          },
          ...(Object.values(selectors)
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
            .filter(e => e !== null) as DropdownItemProps[]),
        ]}
      />
    </div>
  );
};
