import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { WYSIWYG } from './wysiwyg';

const stories = storiesOf('WYSIWYG', module);

stories.add('Simple WYSIWYG', () => <WYSIWYG />);
