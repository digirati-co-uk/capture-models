import * as React from 'react';
import { OpenStreetMapSearch } from './OpenSteetMapSearch';
import renderer from 'react-test-renderer';

describe('OpenStreetMapSearch', () => {
  test('renders correctly', () => {
    const tree = renderer
      .create(<OpenStreetMapSearch OnSubmit={() => {}} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
