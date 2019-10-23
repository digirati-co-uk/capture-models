import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, optionsKnob } from '@storybook/addon-knobs';
import { Label } from './Label';
import { Input } from '../Input/Input';

const stories = storiesOf('Label', module);

stories.addDecorator(withKnobs);

stories.add('Simple Label', () => (
  <Label
    Text={text('the label field', 'Some label')}
    children={
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
    }
  />
));
