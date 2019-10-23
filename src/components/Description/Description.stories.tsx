import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';
import { Description } from './Description';

const stories = storiesOf('Description', module);

stories.addDecorator(withKnobs);

stories.add('Simple Description', () => (
  <Description Text={text('Description Text', 'Some Text')} />
));
