import React from 'react';
import { CaptureModelProvider } from '../../core/capture-model-provider';
import { DocumentStore } from '../../stores/document/document-store';
import { StructureStore } from '../../stores/structure/structure-store';
import { CaptureModel } from '../../types/capture-model';

export const EditorContext: React.FC<{ captureModel: CaptureModel }> = ({ captureModel, children }) => {
  return (
    <CaptureModelProvider captureModel={captureModel}>
      <StructureStore.Provider initialData={captureModel}>
        <DocumentStore.Provider initialData={captureModel}>{children}</DocumentStore.Provider>
      </StructureStore.Provider>
    </CaptureModelProvider>
  );
};
