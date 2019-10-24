import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Autocomplete } from './Autocomplete';

const stories = storiesOf('Autocomplete', module);

interface WrapperState {
  value: string;
  suggestions: Array<string>;
}

class Wrapper extends React.Component<{}, WrapperState> {
  state: Readonly<WrapperState> = {
    value: 'Something',
    suggestions: [
      'Apples',
      'Bananas',
      'Carrots',
      'Digestives',
      'Eggs',
      'Jaffa Cakes',
    ],
  };

  changeValue = (newValue: string) => {
    this.setState({ value: newValue }, () => console.log(this.state.value));
  };

  render() {
    return (
      <Autocomplete
        Suggestions={this.state.suggestions}
        OnChange={this.changeValue}
        Value={this.state.value}
      />
    );
  }
}

stories.add('Simple Autocomplete', () => <Wrapper />);
