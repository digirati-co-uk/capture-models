import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { OpenStreetMapSearch } from './OpenSteetMapSearch';

const stories = storiesOf('OpenStreetMapSearch', module);

const Wrapper: React.FC = () => {
  const [value, setValue] = React.useState('');
  return <OpenStreetMapSearch OnSubmit={setValue} />;
};

stories.add('OpenStreetMapSearch', () => <Wrapper />);
