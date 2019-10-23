import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { DropDown } from './DropDown';

const stories = storiesOf('DropDown', module);

stories.add('Simple DropDown', () => (
  <DropDown
    Options={[
      'Apples',
      'Bananas',
      'Carrots',
      'Digestives',
      'Eggs',
      'Jaffa Cakes',
    ]}
  />
));
