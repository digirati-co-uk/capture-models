import * as React from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import './wysiwyg.styles';

interface WYSIWYGprops {}

export class WYSIWYG extends React.Component<WYSIWYGprops, any> {
  constructor(props: WYSIWYGprops) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
  }
  handleChange(e: EditorState) {
    this.setState({ editorState: e }, console.log(e));
  }
  render() {
    return (
      <div className="wysiwyg">
        <Editor editorState={this.state.editorState} onChange={e => this.handleChange(e)}/>
      </div>
    );
  }
};
