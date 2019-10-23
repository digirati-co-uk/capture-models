import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, optionsKnob } from '@storybook/addon-knobs';
import { Input } from './Input';

const stories = storiesOf('Input', module);

stories.addDecorator(withKnobs);

const options = optionsKnob(
  'InputType',
  {
    Text: 'Text',
    Number: 'Number',
    ListOfStrings: 'string[]',
  },
  'Text',
  { display: 'inline-radio' }
);

stories.add('Simple Input', () => (
  <Input
    InputType={optionsKnob(
      'InputType',
      {
        Text: 'Text',
        Number: 'Number',
        ListOfStrings: 'string[]',
      },
      'Text',
      { display: 'inline-radio' }
    )}
    ChangeHandler={(e: any) => console.log(e)}
    DefaultValue={'Some placeholder'}
  />
));
stories.add('Disabled Input', () => (
  <Input
    InputType={optionsKnob(
      'InputType',
      {
        Text: 'Text',
        Number: 'Number',
        ListOfStrings: 'string[]',
      },
      'Text',
      { display: 'inline-radio' }
    )}
    ChangeHandler={(e: any) => console.log(e)}
    DefaultValue={'Some placeholder'}
    Disabled={true}
  />
));
