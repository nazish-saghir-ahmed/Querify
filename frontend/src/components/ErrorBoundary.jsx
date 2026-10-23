import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Querify ErrorBoundary captured error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#06080D] flex items-center justify-center p-6 text-white font-sans">
          <div className="max-w-lg w-full bg-[#0A0E17] border border-red-500/30 rounded-2xl p-8 shadow-2xl text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-center justify-center mx-auto text-red-400">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Something went wrong</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                An unexpected component exception was intercepted. You can safely reload the application or return to overview.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3.5 rounded-xl bg-[#06080D] border border-white/[0.08] text-left font-mono text-[11px] text-red-300 overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00F5A0] hover:bg-[#00DF89] text-[#06080D] text-xs font-bold tracking-wide shadow-sm transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Application</span>
              </button>

              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F1523] hover:bg-[#131B2A] text-slate-300 text-xs font-medium border border-white/[0.08] transition-all"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
