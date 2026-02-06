import * as React from "react";
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './button';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
                    <div className="max-w-md w-full p-6 border rounded-lg shadow-lg bg-card">
                        <div className="flex items-center gap-3 mb-4 text-destructive">
                            <AlertTriangle className="w-8 h-8" />
                            <h1 className="text-xl font-bold">Application Crashed</h1>
                        </div>
                        <p className="mb-4 text-sm text-muted-foreground">
                            An error occurred while rendering this page.
                        </p>
                        <div className="bg-muted p-4 rounded text-xs font-mono overflow-auto max-h-48 mb-6 whitespace-pre-wrap">
                            {this.state.error?.toString()}
                            {this.state.error?.stack && (
                                <>
                                    <br /><br />
                                    {this.state.error.stack}
                                </>
                            )}
                        </div>
                        <Button
                            onClick={() => window.location.reload()}
                            className="w-full"
                        >
                            Reload Page
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
