import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect, useState } from 'react';
import * as Linking from 'expo-linking';
import { Alert, ActivityIndicator, View, Text } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { TenantProvider } from '@/contexts/TenantContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const { session, loading } = useAuth();
  const [initError, setInitError] = useState<string | null>(null);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Handle deep linking for Stripe payment success
    const handleDeepLink = (event: { url: string }) => {
      const { url } = event;
      console.log('[Layout] Deep link reçu:', url);

      if (
        url.includes('stripe-success') ||
        url.includes('stripe_success') ||
        url.includes('payment_success') ||
        url.includes('payment-success')
      ) {
        console.log('[Layout] 🎉 Paiement Stripe détecté ! Rendu de la page Confirmation...');
        // On ne fait rien ici : Expo Router va naturellement afficher la page stripe-success.tsx
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then((url) => {
      if (url && (
        url.includes('stripe-success') ||
        url.includes('payment_success') ||
        url.includes('payment-success')
      )) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription?.remove();
    };
  }, [router]);

  // Redirection basée sur l'état de la session
  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'auth';
    const inPaymentGroup = segments[0] === 'payment';

    if (!session && !inAuthGroup) {
      console.log('[Layout] Pas de session, redirection vers /auth');
      router.replace('/auth');
    } else if (session && inAuthGroup) {
      // Session présente → accueil directement (le paywall est sur le scan)
      console.log('[Layout] Session détectée, redirection vers /(tabs)');
      router.replace('/(tabs)');
    }
  }, [session, loading, segments]);

  // Timeout de sécurité pour éviter l'écran bleu infini
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        setInitError('Temps de chargement dépassé. Vérifiez votre connexion.');
      }
    }, 10000); // 10 secondes
    return () => clearTimeout(timeout);
  }, [loading]);

  if (initError) {
    return (
      <>
        <StatusBar style="auto" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', padding: 20 }}>
          <Text style={{ color: '#ff6b6b', fontSize: 16, marginBottom: 10, textAlign: 'center' }}>{initError}</Text>
          <Text style={{ color: '#888', fontSize: 12, textAlign: 'center' }}>Redémarrez l'application ou vérifiez le backend</Text>
        </View>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <StatusBar style="auto" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
          <ActivityIndicator size="large" color="#0a7ea4" />
          <Text style={{ color: '#888', marginTop: 20, fontSize: 12 }}>Chargement...</Text>
        </View>
      </>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" />
        <Stack.Screen name="payment" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="stripe-success" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="monitor" />
        <Stack.Screen name="viewer" />
        <Stack.Screen name="video_prepare" />
        <Stack.Screen name="invoice/scan" options={{ title: 'Scanner', presentation: 'modal' }} />
        <Stack.Screen name="invoice/validate" options={{ title: 'Validation' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <TenantProvider>
        <RootLayoutContent />
      </TenantProvider>
    </AuthProvider>
  );
}
