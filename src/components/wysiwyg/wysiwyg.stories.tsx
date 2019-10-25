import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { EditorState } from 'draft-js';
import { WYSIWYG } from './wysiwyg';

const stories = storiesOf('WYSIWYG', module);

const Wrapper: React.FC = () => {
  const [value, setValue] = React.useState(EditorState.createEmpty());
  return <WYSIWYG Value={value} OnChange={setValue} />;
};

stories.add('Simple WYSIYG', () => <Wrapper />);
