import * as React from 'react';
import { Editor, EditorState } from 'draft-js';

export const WYSIWYG: React.FC = () => {
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  );
  return (
    <Editor
      editorState={editorState}
      onChange={setEditorState}
    />
  )
};
