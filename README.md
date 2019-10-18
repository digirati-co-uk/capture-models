# Capture models
This is a repository for working with capture models in JS. It will provide the data-model, operations on the data-model and UI components for editing the data model. It won't provide the UI for all cases and won't bring the UI for going from a piece of content to a selector value.

## Installation

Requirements:

- Node 10.x

Install and start
```
$ yarn install
$ yarn start
```

You will get a FESK+nunjucks environment and a Storybook. Since this is a library, you will also get `./lib` and `./dist` directories with compiled libraries that will be used when publishing to NPM.

## Implementation notes (known issues):
- stylesheets must not be the same name as the components, so if you have a `MyComponent.tsx` then you must name your style file differently. As a convention, I've added `MyComponent.styles.scss` as the convention to work around this issue.
- Importing react needs to be done as `import * as React from 'react';` due to a flaw in the TSConfig.
