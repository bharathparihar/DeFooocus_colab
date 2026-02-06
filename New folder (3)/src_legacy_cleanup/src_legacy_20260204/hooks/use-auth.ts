
import { useState, useEffect, useCallback } from "react";
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from "@/pages/integrations/supabase/client";

export interface AuthState {
    user: User | null;
    session: Session | null;
    loading: boolean;
}

export interface UseAuthReturn extends AuthState {
    signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signUp: (email: string, password: string, data?: any) => Promise<{ error: AuthError | null }>;
    signOut: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = useCallback(async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error };
    }, []);

    const signUp = useCallback(async (email: string, password: string, data?: any) => {
        const redirectUrl = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: redirectUrl, data },
        });
        return { error };
    }, []);

    const signOut = useCallback(async () => {
        await supabase.auth.signOut();
    }, []);

    return { user, session, loading, signIn, signUp, signOut };
};
