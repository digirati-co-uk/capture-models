import * as React from 'react';
import { storiesOf } from '@storybook/react';

import './_style-stories.scss';

const StyleGuide = storiesOf('Style Guide', module);

StyleGuide.add('Color Themes', () => (
  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      width: '500px',
    }}
  >
    <div className="color-sample color-sample--primary-base"></div>
    <div className="color-sample color-sample--primary-dark"></div>
    <div className="color-sample color-sample--primary-light"></div>
    <div className="color-sample color-sample--accent-base"></div>
    <div className="color-sample color-sample--accent-dark"></div>
    <div className="color-sample color-sample--accent-light"></div>
    <div className="color-sample color-sample--foreground-base"></div>
    <div className="color-sample color-sample--foreground-dark"></div>
    <div className="color-sample color-sample--foreground-light"></div>
    <div className="color-sample color-sample--background-base"></div>
    <div className="color-sample color-sample--background-dark"></div>
    <div className="color-sample color-sample--background-light"></div>
  </div>
));

StyleGuide.add('Typography', () => (
  <div
    className="typography-sample"
    style={{
      display: 'block',
    }}
  >
    <div className="typography-sample typography-sample--xs">
      Sample text xs
    </div>
    <div className="typography-sample typography-sample--sm">
      Sample text sm
    </div>
    <div className="typography-sample typography-sample--bae">
      Sample text base
    </div>
    <div className="typography-sample typography-sample--md">
      Sample text md
    </div>
    <div className="typography-sample typography-sample--lg">
      Sample text lg
    </div>
    <div className="typography-sample typography-sample--xl">
      Sample text xl
    </div>
  </div>
));
