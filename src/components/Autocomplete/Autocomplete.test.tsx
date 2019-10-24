import * as React from 'react';
import { Autocomplete } from './Autocomplete';
import renderer from 'react-test-renderer';

describe('Autocomplete', () => {
  test('renders correctly', () => {
    const tree = renderer
      .create(
        <Autocomplete
          Suggestions={['a', 'b']}
          Value={'a'}
          OnChange={() => {}}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
