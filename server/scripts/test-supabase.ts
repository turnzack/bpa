// Script pour tester la connexion Supabase et vérifier la structure des tables

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function testSupabase() {
  console.log('🔍 Test de connexion Supabase...');
  console.log('URL:', SUPABASE_URL);

  // Tester la connexion
  const { data: { user }, error: authError } = await supabase.auth.getUser(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwcnN1dHBnbmV6b21veWZhbnR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NjA0NTgsImV4cCI6MjA3NTMzNjQ1OH0.YddcTfsCaouvHAJ-udoGgIu-g0jKEXiXaIcL1h6ALLA'
  );

  if (authError) {
    console.log('⚠️  Token anon invalide (normal pour un test direct)');
  }

  // Lister les tables disponibles
  console.log('\n📋 Vérification des tables...');

  // Vérifier table 'bsd'
  const { data: bsdData, error: bsdError } = await supabase
    .from('bsd')
    .select('*')
    .limit(1);

  if (bsdError) {
    console.log('❌ Table "bsd":', bsdError.message);
  } else {
    console.log('✅ Table "bsd" existe');
    console.log('   Colonnes détectées:', Object.keys(bsdData?.[0] || {}));
  }

  // Vérifier table 'stripe_events'
  const { data: stripeData, error: stripeError } = await supabase
    .from('stripe_events')
    .select('*')
    .limit(1);

  if (stripeError) {
    console.log('❌ Table "stripe_events":', stripeError.message);
  } else {
    console.log('✅ Table "stripe_events" existe');
    console.log('   Colonnes détectées:', Object.keys(stripeData?.[0] || {}));
  }

  // Vérifier table 'scan_payments'
  const { data: scanData, error: scanError } = await supabase
    .from('scan_payments')
    .select('*')
    .limit(1);

  if (scanError) {
    console.log('❌ Table "scan_payments":', scanError.message);
  } else {
    console.log('✅ Table "scan_payments" existe');
    console.log('   Colonnes détectées:', Object.keys(scanData?.[0] || {}));
  }

  // Vérifier les utilisateurs
  const { count, error: countError } = await supabase
    .from('auth.users')
    .select('*', { head: true, count: 'exact' });

  if (countError) {
    console.log('⚠️  Impossible de compter les utilisateurs:', countError.message);
  } else {
    console.log('👥 Utilisateurs inscrits:', count);
  }

  console.log('\n✅ Test terminé!');
}

testSupabase().catch(console.error);
