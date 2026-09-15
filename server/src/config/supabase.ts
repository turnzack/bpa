// OBSOLÈTE : Le projet BPA a été intégralement migré vers Neon PostgreSQL.
// Ce fichier est conservé uniquement pour la rétrocompatibilité temporaire des anciens services.
import dotenv from 'dotenv';
dotenv.config();

console.log('ℹ️  Supabase désactivé : Base de données Neon PostgreSQL active.');

export const supabase: any = {
  from: () => ({
    select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
    upsert: () => Promise.resolve({ data: null, error: null }),
  }),
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase désactivé, utilisez Neon Auth') })
  }
};

export const masterSupabase = supabase;
export const createArtisanClient = (_url?: any, _key?: any) => supabase;
