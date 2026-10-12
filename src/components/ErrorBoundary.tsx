import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-rose-50 rounded-2xl border border-rose-200 w-full min-h-[200px]">
          <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-3">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
          </div>
          <h3 className="text-sm font-extrabold text-rose-800 mb-2">
            {this.props.fallbackMessage || 'متأسفانه در بارگذاری این بخش خطایی رخ داد'}
          </h3>
          <p className="text-[11px] text-rose-600/80 mb-4 font-mono dir-ltr max-w-xs truncate">
            {this.state.error?.message}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="flex items-center gap-2 px-4 py-2 bg-white text-rose-700 text-xs font-bold rounded-lg border border-rose-200 shadow-sm hover:bg-rose-50 transition-colors"
          >
            <RefreshCcw className="w-3 h-3" />
            تلاش مجدد
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
