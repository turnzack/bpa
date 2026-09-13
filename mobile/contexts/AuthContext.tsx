import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { masterSupabase } from '../services/authService';
import * as SecureStore from 'expo-secure-store';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    lastEmail: string; // Email pré-rempli du dernier utilisateur connecté
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastEmail, setLastEmail] = useState('');

    useEffect(() => {
        let mounted = true;
        const timeoutId = setTimeout(() => {
            if (mounted && loading) {
                console.warn('[AuthContext] Timeout - initial session check took too long');
                setLoading(false);
            }
        }, 8000);

        const init = async () => {
            // Charger le dernier email utilisé (pré-remplissage)
            try {
                const saved = await SecureStore.getItemAsync('bpa_last_email');
                if (saved && mounted) setLastEmail(saved);
            } catch {}

            // Vérifier la session actuelle au lieu de forcer la déconnexion
            const { data: { session } } = await masterSupabase.auth.getSession();
            if (mounted) {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
                clearTimeout(timeoutId);
            }
        };

        init();

        // Écoute les changements (connexion/déconnexion en cours de session)
        const { data: { subscription } } = masterSupabase.auth.onAuthStateChange((_event, session) => {
            if (mounted) {
                setSession(session);
                setUser(session?.user ?? null);
            }
        });

        return () => {
            mounted = false;
            clearTimeout(timeoutId);
            subscription.unsubscribe();
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        console.log('[AuthContext] Tentative de connexion avec:', email);
        try {
            const { data, error } = await masterSupabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) {
                console.error('[AuthContext] Erreur connexion:', error);
                throw error;
            }
            // 💾 Sauvegarder l'email pour le pré-remplissage à la prochaine ouverture
            try { await SecureStore.setItemAsync('bpa_last_email', email); } catch {}
            setLastEmail(email);
            console.log('[AuthContext] Connexion réussie:', data.user?.email);
        } catch (error: any) {
            console.error('[AuthContext] Exception:', error);
            throw new Error(error.message || 'Échec de la connexion');
        }
    };

    const signUp = async (email: string, password: string) => {
        const { error } = await masterSupabase.auth.signUp({
            email,
            password,
        });
        if (error) throw error;
    };

    const signOut = async () => {
        await masterSupabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ session, user, loading, lastEmail, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
