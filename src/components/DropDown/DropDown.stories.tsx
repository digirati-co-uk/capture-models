import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { DropDown } from './DropDown';

const stories = storiesOf('DropDown', module);

const Wrapper: React.FC = () => {
  const [value, setValue] = React.useState('Apples');
  const [options] = React.useState([
    'Apples',
    'Bananas',
    'Carrots',
    'Digestives',
    'Eggs',
    'Jaffa Cakes',
  ]);
  return <DropDown Options={options} Selected={value} OnChange={setValue} />;
};

stories.add('Simple DropDown', () => <Wrapper />);
