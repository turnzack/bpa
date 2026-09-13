import { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';

export default function StripeSuccessScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    useEffect(() => {
        // Optionnel : on prévient le Backend qu'on est de retour ou on laisse /index.tsx rafraîchir
        setTimeout(() => {
            router.replace('/(tabs)');
        }, 2000); // 2 secondes pour un affichage stable du succès
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: '#0F0F0F', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 40, marginBottom: 20 }}>🎉</Text>
            <Text style={{ color: '#4CAF50', fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Paiement Validé</Text>
            <Text style={{ color: 'white', fontSize: 16, marginBottom: 30 }}>Déblocage de l'Audit Souverain en cours...</Text>
            <ActivityIndicator size="large" color="#4CAF50" />
        </View>
    );
}
