import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import { FieldInstance } from '../../connected-components/FieldInstance';
import { Revisions as RevisionStore } from '../../stores/revisions';
import { defaultTheme } from '../../themes';
import AtlasViewer from './Atlas';
import './index';
const model = require('../../../../../fixtures/04-selectors/05-wunder-selector.json');

export default { title: 'Content Types|Atlas' };

// Emulate the selector flow from FieldWrapper.
// 1. Add button to "select" selector
// 2. Allow editing that one selector
// 3. ??
export const Simple: React.FC = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <RevisionStore.Provider
        initialData={{ captureModel: model, initialRevision: 'e801f905-5afc-4612-9e59-2b78cf407b9d' }}
      >
        <AtlasViewer
          id="123"
          type="atlas"
          state={{
            canvasId: 'https://wellcomelibrary.org/iiif/b18035723/canvas/c0',
            manifestId: 'https://wellcomelibrary.org/iiif/b18035723/manifest',
          }}
        />
        <FieldInstance
          field={{
            id: '35ffb3e1-76ef-437e-acce-3523db75b54a',
            type: 'text-field',
            selector: {
              id: 'd35b5a96-e653-4b9b-8f6c-a93ea590dbd4',
              type: 'box-selector',
              state: {
                height: 771,
                width: 2199,
                x: 164,
                y: 235,
              },
            },
            label: 'Title',
            description: 'The title of the book as it is printed on the cover.',
            value: 'WUNDER DER VERERBUNG',
          }}
          path={[]}
        />
      </RevisionStore.Provider>
    </ThemeProvider>
  );
};
