// Configuration de l'application mobile BPA

// Récupère l'adresse IP de la machine depuis .env
// Sur Android, NE JAMAIS utiliser 'localhost' (pointe vers l'appareil)
// Utiliser l'IP locale de votre PC (ex: 192.168.1.x)

export const CONFIG = {
    // URL du backend API
    BACKEND_URL: process.env.EXPO_PUBLIC_BACKEND_URL || 'http://192.168.1.148:4000',
    
    // Supabase Master pour l'authentification
    MASTER_SUPABASE_URL: process.env.EXPO_PUBLIC_MASTER_SUPABASE_URL || 'https://mgqwcuhlcsovbdihqfpd.supabase.co',
    MASTER_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_MASTER_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ncXdjdWhsY3NvdmJkaWhxZnBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NTcwMDEsImV4cCI6MjA4MjQzMzAwMX0.1azHAhtN8AmxYMse0h5_Ne-Y_xl1bJcRmE2O1kOm0GA',
};
