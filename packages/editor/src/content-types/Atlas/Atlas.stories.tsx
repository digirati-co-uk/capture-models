import * as React from 'react';
import { ThemeProvider } from 'styled-components/macro';
import { FieldInstance } from '../../connected-components/FieldInstance';
import { Revisions as RevisionStore } from '../../stores/revisions';
import { defaultTheme } from '../../themes';
import AtlasViewer from './Atlas';
import './index';
import { FieldInstanceReadOnly } from '../../components/FieldInstanceReadOnly/FieldInstanceReadOnly';
import { useEffect, useState } from 'react';
import { Runtime } from '@atlas-viewer/atlas';
const model = require('../../../../../fixtures/04-selectors/05-wunder-selector.json');
const ocrModel = require('../../../../../fixtures/02-nesting/06-ocr.json');

export default { title: 'Content Types|Atlas' };

export const SwitchEditMode: React.FC = () => {
  const revisionEditMode = RevisionStore.useStoreState(s => s.revisionEditMode);
  const setRevisionMode = RevisionStore.useStoreActions(a => a.setRevisionMode);

  useEffect(() => {
    if (!revisionEditMode) {
      setRevisionMode({ editMode: true });
    }
  }, [revisionEditMode, setRevisionMode]);

  return null;
};

// Emulate the selector flow from FieldWrapper.
// 1. Add button to "select" selector
// 2. Allow editing that one selector
// 3. ??
export const Simple: React.FC = () => {
  const [runtime, setRuntime] = useState<Runtime>();

  return (
    <ThemeProvider theme={defaultTheme}>
      <RevisionStore.Provider
        initialData={{ captureModel: model, initialRevision: 'e801f905-5afc-4612-9e59-2b78cf407b9d' }}
      >
        <SwitchEditMode />
        <div style={{ display: 'flex' }}>
          <div style={{ flex: '1 1 0px' }}>
            <AtlasViewer
              id="123"
              type="atlas"
              state={{
                canvasId: 'https://wellcomelibrary.org/iiif/b18035723/canvas/c0',
                manifestId: 'https://wellcomelibrary.org/iiif/b18035723/manifest',
              }}
              options={{
                height: 600,
                selectorVisibility: {
                  adjacentSelectors: false,
                  currentSelector: true,
                  displaySelectors: true,
                  topLevelSelectors: true,
                },
                custom: {
                  onCreateAtlas(ctx) {
                    setRuntime(ctx.runtime);
                  },
                },
              }}
            />
          </div>
          <div style={{ width: 400, padding: 20, margin: '0 auto' }}>
            <button
              onClick={() => {
                if (runtime) {
                  runtime.world.gotoRegion({
                    height: 771,
                    width: 2199,
                    x: 164,
                    y: 235,
                  });
                }
              }}
            >
              Go to region
            </button>
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
              property="any"
            />

            <FieldInstanceReadOnly
              fields={[
                {
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
                },
              ]}
            />
          </div>
        </div>
      </RevisionStore.Provider>
    </ThemeProvider>
  );
};

export const OCRAtlas: React.FC = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <RevisionStore.Provider
        initialData={{ captureModel: ocrModel, initialRevision: '320a754b-4546-4271-b226-c97a90807950' }}
      >
        <AtlasViewer
          id="123"
          type="atlas"
          state={{
            canvasId: 'https://wellcomelibrary.org/iiif/b18035723/canvas/c35',
            manifestId: 'https://wellcomelibrary.org/iiif/b18035723/manifest',
          }}
          options={{
            height: 600,
            selectorVisibility: {
              adjacentSelectors: false,
              currentSelector: true,
              displaySelectors: true,
              topLevelSelectors: true,
            },
            custom: {
              onCreateAtlas(ctx) {
                // setRuntime(ctx.runtime);
              },
            },
          }}
        />
      </RevisionStore.Provider>
    </ThemeProvider>
  );
};

export const OCRAtlasNoRevision: React.FC = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <RevisionStore.Provider initialData={{ captureModel: ocrModel }}>
        <AtlasViewer
          id="123"
          type="atlas"
          state={{
            canvasId: 'https://wellcomelibrary.org/iiif/b18035723/canvas/c35',
            manifestId: 'https://wellcomelibrary.org/iiif/b18035723/manifest',
          }}
          options={{
            height: 600,
            selectorVisibility: {
              adjacentSelectors: false,
              currentSelector: true,
              displaySelectors: true,
              topLevelSelectors: true,
            },
            custom: {
              onCreateAtlas(ctx) {
                // setRuntime(ctx.runtime);
              },
            },
          }}
        />
      </RevisionStore.Provider>
    </ThemeProvider>
  );
};
