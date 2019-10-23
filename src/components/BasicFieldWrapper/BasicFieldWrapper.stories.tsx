import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';
import { BasicFieldWrapper } from './BasicFieldWrapper';
import { Input } from '../Input/Input';
import { Label } from '../Label/Label';

const stories = storiesOf('BasicFieldWrapper', module);

stories.addDecorator(withKnobs);

stories.add('Simple BasicFieldWrapper', () => (
  <BasicFieldWrapper>
    {
      <Label
        Text={'Some label'}
        children={
          <Input
            InputType={'Text'}
            ChangeHandler={(e: any) => console.log(e)}
            DefaultValue={'Some placeholder'}
          />
        }
      />
    }
  </BasicFieldWrapper>
));
