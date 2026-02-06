import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/theme-provider";
import { Toaster } from "@/ui/toaster";
import { Toaster as Sonner } from "@/ui/sonner";
import { TooltipProvider } from "@/ui/tooltip";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Pages
import Index from "./Index";
import Auth from "./Auth";
import Admin from "./Admin";

const queryClient = new QueryClient();

const NavigationHelper = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'x') {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (!open) return null;

    return (
        <div className="fixed bottom-4 left-4 z-[9999] bg-background border shadow-xl rounded-lg p-2 flex gap-2">
            <button onClick={() => { navigate('/'); setOpen(false); }} className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs">Home</button>
            <button onClick={() => { navigate('/auth'); setOpen(false); }} className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs">Auth</button>
            <button onClick={() => { navigate('/admin'); setOpen(false); }} className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs">Admin</button>
            <button onClick={() => setOpen(false)} className="px-3 py-1 bg-muted rounded text-xs">Close</button>
        </div>
    );
};

const NotFound = () => (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground">Page not found</p>
        <button onClick={() => window.location.href = '/'} className="text-primary hover:underline">Go back home</button>
    </div>
);

const App = () => (
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <TooltipProvider>
                    <BrowserRouter>
                        <NavigationHelper />
                        <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/auth" element={<Auth />} />
                            <Route path="/admin" element={<Admin />} />
                            <Route path="/v/:slug" element={<Index />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </BrowserRouter>
                    <Toaster />
                    <Sonner position="top-center" />
                </TooltipProvider>
            </ThemeProvider>
        </QueryClientProvider>
    </React.StrictMode>
);

export default App;
