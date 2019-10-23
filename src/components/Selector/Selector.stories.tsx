import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';
import { Selector } from './Selector';

const stories = storiesOf('Selector', module);

stories.addDecorator(withKnobs);

stories.add('Simple Selector', () => (
  <Selector Text={text('Selector Text', 'Some Text')} />
));
