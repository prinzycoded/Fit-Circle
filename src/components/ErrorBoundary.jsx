import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-theme-bg text-theme-primary antialiased font-body flex items-center justify-center p-8">
          <div className="card max-w-lg w-full text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h2 className="text-lg font-display font-extrabold text-theme-primary">Something went wrong</h2>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-left">
              <p className="text-xs font-mono text-red-700 break-words">{this.state.error?.message || "Unknown error"}</p>
            </div>
            <p className="text-xs text-theme-secondary">Check the browser console (F12) for the full stack trace.</p>
            <button
              onClick={() => { this.setState({ error: null }); window.location.reload(); }}
              className="bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-display font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
