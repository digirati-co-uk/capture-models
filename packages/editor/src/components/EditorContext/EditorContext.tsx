import React from 'react';
import { createContext } from '@capture-models/helpers';
import { DocumentStore } from '../../stores/document/document-store';
import { StructureStore } from '../../stores/structure/structure-store';
import { CaptureModel } from '@capture-models/types';

export const [useCaptureModel, CaptureModelProvider] = createContext<CaptureModel>();

export const EditorContext: React.FC<{
  captureModel: CaptureModel;
  onDocumentChange?: (doc: CaptureModel['document']) => void;
  onStructureChange?: (structure: CaptureModel['structure']) => void;
}> = ({ captureModel, onDocumentChange, onStructureChange, children }) => {
  return (
    <CaptureModelProvider value={captureModel}>
      <StructureStore.Provider initialData={{ captureModel, onStructureChange }}>
        <DocumentStore.Provider initialData={{ captureModel, onDocumentChange }}>{children}</DocumentStore.Provider>
      </StructureStore.Provider>
    </CaptureModelProvider>
  );
};
