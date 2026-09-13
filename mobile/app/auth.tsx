import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/Colors';

export default function AuthScreen() {
  const router = useRouter();
  const { signIn, signUp, loading, session } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Navigation automatique après connexion
  useEffect(() => {
    if (session && !isSubmitting) {
      console.log('[AuthScreen] Session détectée, navigation vers l\'accueil');
      router.replace('/(tabs)');
    }
  }, [session, isSubmitting]);

  const handleSubmit = async () => {
    setError('');
    setIsSubmitting(true);

    if (!email || !password) {
      setError('Email et mot de passe requis');
      setIsSubmitting(false);
      return;
    }

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError('Les mots de passe ne correspondent pas');
          setIsSubmitting(false);
          return;
        }
        await signUp(email, password);
        Alert.alert('Succès', 'Compte créé avec succès! Vous êtes maintenant connecté.');
        // La navigation se fera via le useEffect qui détectera la session
      } else {
        await signIn(email, password);
        // La navigation se fera via le useEffect qui détectera la session
      }
    } catch (err: any) {
      setError(err.message || 'Erreur d\'authentification');
      Alert.alert('Erreur', err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{isSignUp ? 'Créer un compte' : 'Se connecter'}</Text>
        <Text style={styles.subtitle}>BPA - Analyse de Devis</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={Colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          editable={!loading}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor={Colors.textSecondary}
          value={password}
          onChangeText={setPassword}
          editable={!isSubmitting}
          secureTextEntry
        />

        {isSignUp && (
          <TextInput
            style={styles.input}
            placeholder="Confirmer le mot de passe"
            placeholderTextColor={Colors.textSecondary}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            editable={!isSubmitting}
            secureTextEntry
          />
        )}

        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>
              {isSignUp ? 'Créer un compte' : 'Se connecter'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} disabled={isSubmitting}>
          <Text style={styles.toggleText}>
            {isSignUp
              ? 'Vous avez un compte? Se connecter'
              : 'Pas de compte? Créer un'}
          </Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Comment ça marche:</Text>
          <Text style={styles.infoText}>
            1. Créez ou connectez-vous à votre compte{'\n'}
            2. Scannez un devis ou une facture{'\n'}
            3. Payez 1.99€ pour l'analyse{'\n'}
            4. Recevez les résultats instantanément
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 32,
  },
  errorText: {
    color: '#ff6b6b',
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 8,
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    color: Colors.textPrimary,
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.accentBlue,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleText: {
    color: Colors.accentBlue,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 32,
  },
  infoBox: {
    backgroundColor: Colors.cardBg,
    borderLeftColor: Colors.accentBlue,
    borderLeftWidth: 4,
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  infoTitle: {
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
});
