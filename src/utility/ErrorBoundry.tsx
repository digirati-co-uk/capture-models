import React from 'react';
import RedBox from 'redbox-react';
import { Message } from 'semantic-ui-react';

export class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ error: error });
  }

  state: { error?: Error } = { error: undefined };

  render() {
    if (this.state.error) {
      return (
        <div style={{ position: 'relative' }}>
          <Message negative>
            <Message.Header>{this.state.error.message}</Message.Header>
            <pre><code>{this.state.error.stack}</code></pre>
          </Message>
        </div>
      );
    }
    return this.props.children;
  }
}
