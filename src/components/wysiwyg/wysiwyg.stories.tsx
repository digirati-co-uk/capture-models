import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';
import { WYSIWYG } from './wysiwyg';

const stories = storiesOf('WYSIWYG', module);

stories.addDecorator(withKnobs);

stories.add(
  'Simple WYSIWYG',
  () => (<WYSIWYG/>)
);
