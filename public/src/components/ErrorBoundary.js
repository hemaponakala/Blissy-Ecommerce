import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ maxWidth: 640, margin: '32px auto', padding: 24, background: '#151a22', border: '1px solid #1e2533', borderRadius: 12 }}>
          <h2 style={{ marginTop: 0 }}>Something went wrong.</h2>
          <p>{this.state.error?.message || 'Unexpected error occurred.'}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #2a3344', background: 'transparent', color: '#e8ecf1', cursor: 'pointer' }}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}