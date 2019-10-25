import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';
import { TextArea } from './TextArea';

const stories = storiesOf('TextArea', module);

stories.addDecorator(withKnobs);

const Wrapper: React.FC = () => {
  const [value, setValue] = React.useState('Some text');

  const handleValue = (newValue: string) => {
    console.log(newValue);
    setValue(newValue);
  };
  return <TextArea Text={value} OnChange={handleValue} />;
};

stories.add('Simple TextArea', () => <Wrapper />);
