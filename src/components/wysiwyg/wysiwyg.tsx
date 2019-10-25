import * as React from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import './wysiwyg.styles';

interface WYSIWYGProps {
  OnChange(editorState: EditorState): void;
  Value: EditorState;
}

export const WYSIWYG: React.FC<WYSIWYGProps> = ({ OnChange, Value }) => {
  const _onButtonClick = (type: string) => {
    OnChange(RichUtils.toggleInlineStyle(Value, type));
  };

  return (
    <div className="wysiwyg">
      <div className="wysiwyg__control-buttons">
        <button className="control-button" onClick={() => _onButtonClick('B')}>
          Bold
        </button>
        <button
          className="control-button"
          onClick={() => _onButtonClick('ITALIC')}
        >
          Italics
        </button>
      </div>
      <Editor editorState={Value} onChange={OnChange} />
    </div>
  );
};
