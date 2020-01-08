import React from 'react';
import { CaptureModelProvider } from '../../core/capture-model-provider';
import { DocumentStore } from '../../stores/document/document-store';
import { StructureStore } from '../../stores/structure/structure-store';
import { CaptureModel } from '../../types/capture-model';

export const EditorContext: React.FC<{
  captureModel: CaptureModel;
  onDocumentChange?: (doc: CaptureModel['document']) => void;
  onStructureChange?: (structure: CaptureModel['structure']) => void;
}> = ({ captureModel, onDocumentChange, onStructureChange, children }) => {
  return (
    <CaptureModelProvider captureModel={captureModel}>
      <StructureStore.Provider initialData={{ captureModel, onStructureChange }}>
        <DocumentStore.Provider initialData={{ captureModel, onDocumentChange }}>{children}</DocumentStore.Provider>
      </StructureStore.Provider>
    </CaptureModelProvider>
  );
};
