import React from 'react';
import { HashRouter } from 'react-router-dom';
import { DatabaseProvider } from '../../core/database';
import { CaptureModelEditor } from './CaptureModelEditor';

const CaptureModelEditorApp: React.FC = () => (
  <DatabaseProvider databaseName="capture-model-editor">
    <HashRouter>
      <CaptureModelEditor />
    </HashRouter>
  </DatabaseProvider>
);

export default CaptureModelEditorApp;
