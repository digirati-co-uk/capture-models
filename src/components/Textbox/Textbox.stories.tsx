import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';
import { Textbox } from './Textbox';
const stories = storiesOf('Textbox', module);

stories.addDecorator(withKnobs);

stories.add('Simple textbox', () => (
  <Textbox Text={text('value', 'Some sample value')} />
));
