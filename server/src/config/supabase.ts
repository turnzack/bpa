import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Configuration Supabase - Projet: mgqwcuhlcsovbdihqfpd
// Tables: entreprises, clients, devis, factures, encaissements
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mgqwcuhlcsovbdihqfpd.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.warn('⚠️  SUPABASE_SERVICE_ROLE_KEY manquante dans .env');
}

// Client Supabase principal (utilisé par les services TCE et webhooks)
// Utilise la service_role key pour bypass RLS
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY || '', {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

// Client Supabase pour l'authentification utilisateur (utilise anon key)
export const masterSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY || SUPABASE_SERVICE_KEY || '', {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

// Helper pour créer un client avec une clé personnalisée
export const createArtisanClient = (url: string, key: string) => {
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
};

console.log('✅ Supabase configuré:', SUPABASE_URL);
console.log('📋 Tables: entreprises, clients, devis, factures, encaissements');
