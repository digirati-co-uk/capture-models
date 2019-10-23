import * as React from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import './wysiwyg.styles';

interface WYSIWYGprops {}

export class WYSIWYG extends React.Component<WYSIWYGprops, any> {
  constructor(props: WYSIWYGprops) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
  }
  onChange = (editorState: EditorState) => this.setState({ editorState });

  _onButtonClick(type: string) {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, type));
  }

  render() {
    return (
      <div className="wysiwyg">
        <div className="wysiwyg__control-buttons">
          <button
            className="control-button"
            onClick={() => this._onButtonClick('BOLD')}
          >
            Bold
          </button>
          <button
            className="control-button"
            onClick={() => this._onButtonClick('ITALIC')}
          >
            Italics
          </button>
        </div>
        <Editor editorState={this.state.editorState} onChange={this.onChange}/>
      </div>
    );
  }
}
