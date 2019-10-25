import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';
import { TextArea } from './TextArea';

const stories = storiesOf('TextArea', module);

stories.addDecorator(withKnobs);

const Wrapper: React.FC = () => {
  const [value, setValue] = React.useState('Some text');

  return <TextArea Text={value} OnChange={setValue} />;
};

stories.add('Simple TextArea', () => <Wrapper />);
