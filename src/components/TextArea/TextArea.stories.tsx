import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';
import { TextArea } from './TextArea';

const stories = storiesOf('TextArea', module);

stories.addDecorator(withKnobs);

stories.add('Simple TextArea', () => (
  <TextArea Text={text('TextArea Text', 'Some Text')} />
));
