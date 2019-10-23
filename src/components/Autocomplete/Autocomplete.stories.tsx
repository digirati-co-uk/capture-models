import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Autocomplete } from './Autocomplete';

const stories = storiesOf('Autocomplete', module);

stories.add('Simple Autocomplete', () => (
  <Autocomplete
    Suggestions={[
      'Apples',
      'Bananas',
      'Carrots',
      'Digestives',
      'Eggs',
      'Jaffa Cakes',
    ]}
  />
));
