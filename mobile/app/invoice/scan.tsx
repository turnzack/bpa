import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTenant } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { CONFIG } from '@/constants/Config';
import { useRouter } from 'expo-router';
// import { CameraView } from 'expo-camera'; // If we used expo-camera

export default function InvoiceScanScreen() {
    const [image, setImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const { session } = useAuth();
    const { artisanClient, error: tenantError } = useTenant();
    const router = useRouter();

    const pickImage = async () => {
        // Request permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'We need camera access to scan invoices.');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const uploadInvoice = async () => {
        if (!image || !session?.access_token) return;

        setUploading(true);
        try {
            // First, initiate scan and check payment requirement
            const initResponse = await axios.post(`${CONFIG.BACKEND_URL}/api/ai/initiate-scan`, {}, {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            const { scanId, paymentRequired } = initResponse.data;

            if (paymentRequired) {
                // Redirect to payment
                const paymentResponse = await axios.post(`${CONFIG.BACKEND_URL}/api/stripe/create-scan-payment`, {
                    scanId: scanId
                }, {
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`
                    }
                });

                if (paymentResponse.data.url) {
                    // Open payment URL in browser
                    await Linking.openURL(paymentResponse.data.url);
                    Alert.alert('Paiement requis', 'Veuillez compléter le paiement de 1.99€ pour continuer l\'analyse.');
                    setUploading(false);
                    return;
                }
            }

            // If payment not required or already paid, proceed with upload
            const formData = new FormData();
            const filename = image.split('/').pop() || 'upload.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image`;

            // @ts-ignore
            formData.append('file', { uri: image, name: filename, type });
            formData.append('scanId', scanId);

            console.log('Uploading to:', `${CONFIG.BACKEND_URL}/api/invoices/upload`);

            const response = await axios.post(`${CONFIG.BACKEND_URL}/api/invoices/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            console.log('Upload success:', response.data);
            Alert.alert('Succès', 'Facture analysée avec succès !');

            setImage(null);

        } catch (error: any) {
            console.error('Upload failed:', error);
            if (error.response?.status === 402) {
                Alert.alert('Paiement requis', 'Un paiement de 1.99€ est nécessaire pour analyser ce document.');
            } else {
                Alert.alert('Erreur', error.response?.data?.error || "L'envoi a échoué");
            }
        } finally {
            setUploading(false);
        }
    };

    if (tenantError) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>Erreur Tenant: {tenantError}</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Scanner une Facture</Text>

            <View style={styles.previewContainer}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.image} />
                ) : (
                    <Text style={styles.placeholder}>Aucune image sélectionnée</Text>
                )}
            </View>

            <View style={styles.controls}>
                <TouchableOpacity style={styles.button} onPress={takePhoto}>
                    <Text style={styles.buttonText}>Prendre Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSecondary} onPress={pickImage}>
                    <Text style={styles.buttonTextSecondary}>Galerie</Text>
                </TouchableOpacity>
            </View>

            {image && (
                <TouchableOpacity
                    style={[styles.buttonUpload, uploading && styles.disabled]}
                    onPress={uploadInvoice}
                    disabled={uploading}
                >
                    {uploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Analyser (OCR)</Text>}
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    previewContainer: { width: '100%', height: 400, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginBottom: 20, overflow: 'hidden' },
    image: { width: '100%', height: '100%', resizeMode: 'contain' },
    placeholder: { color: '#888' },
    controls: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, flex: 1, alignItems: 'center' },
    buttonSecondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#007AFF', padding: 15, borderRadius: 8, flex: 1, alignItems: 'center' },
    buttonUpload: { backgroundColor: '#34C759', padding: 15, borderRadius: 8, width: '100%', alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    buttonTextSecondary: { color: '#007AFF', fontWeight: 'bold' },
    disabled: { opacity: 0.7 },
    error: { color: 'red' }
});
