import * as React from 'react';
import { Textbox } from './Textbox';
import { shallow } from 'enzyme';

describe('Textbox', () => {
  test('simple test', () => {
    const wrapper = shallow(<Textbox>Some sample text</Textbox>);

    expect(wrapper.text()).toEqual('Some sample text');
  });
});
