import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';

export default function ViewerScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const jobId = params.jobId;

    const BASE_URL = "http://localhost:4000";
    const viewerUrl = `${BASE_URL}/viewer/${jobId}`;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={styles.title}>Visualiseur 3D - Scan #{jobId}</Text>
            </View>

            {Platform.OS === 'web' ? (
                <iframe
                    src={viewerUrl}
                    style={{ flex: 1, border: 'none', width: '100%', height: '100%' }}
                    title="3D Viewer"
                />
            ) : (
                <WebView
                    source={{ uri: viewerUrl }}
                    style={styles.webview}
                    startInLoadingState={true}
                    renderLoading={() => <ActivityIndicator style={styles.loading} size="large" color={Colors.accentBlue} />}
                />
            )}

            <TouchableOpacity style={styles.backBtnWrapper} onPress={() => router.back()}>
                <View style={styles.backBtn}>
                    <Text style={styles.backBtnText}>← Retour</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        height: 50,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    webview: {
        flex: 1,
        backgroundColor: '#000',
        marginBottom: 100,
    },
    loading: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -20,
        marginLeft: -20,
    },
    backBtnWrapper: {
        position: 'absolute',
        bottom: 50,
        left: 60,
    },
    backBtn: {
        backgroundColor: 'rgba(51, 102, 204, 0.9)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    backBtnText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
