import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { tempFileStore } from './tempStore';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Helper to fetch blob safely on web
// Helper to fetch blob safely on web
const fetchBlob = (uri: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        console.log("XHR: Starting request for", uri);

        xhr.onload = function () {
            console.log("XHR: onload", xhr.status);
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(new Error(`XHR load failed: ${xhr.status}`));
            }
        };
        xhr.onerror = function (e) {
            console.error("XHR: onerror", e);
            reject(new TypeError("XHR Network request failed"));
        };
        xhr.onprogress = function (e) {
            if (e.lengthComputable) {
                console.log(`XHR: Progress ${e.loaded}/${e.total}`);
            }
        };
        xhr.ontimeout = function () {
            console.error("XHR: timeout");
            reject(new Error("XHR Timeout"));
        };
        xhr.timeout = 15000; // 15s timeout

        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
    });
};

export default function VideoPrepareScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const videoUri = params.videoUri as string;
    const [uploading, setUploading] = useState(false);

    /*
    const player = useVideoPlayer(videoUri, player => {
        player.loop = true;
        player.play();
    });
    */

    const handleUpload = async () => {
        setUploading(true);
        try {
            const formData = new FormData();

            // Préparer le fichier pour l'upload
            if (Platform.OS === 'web') {
                if (tempFileStore.file) {
                    console.log("Using File object from tempStore", tempFileStore.file);
                    formData.append('video', tempFileStore.file, 'video.mp4');
                } else {
                    console.log("Attempting to fetch video blob via XHR from:", videoUri);
                    try {
                        const blob = await fetchBlob(videoUri);
                        console.log("Blob created (XHR):", blob.size, blob.type);
                        formData.append('video', blob, 'video.mp4');
                    } catch (blobErr) {
                        console.error("Error fetching video blob:", blobErr);
                        throw blobErr;
                    }
                }
            } else {
                formData.append('video', {
                    uri: videoUri,
                    type: 'video/mp4',
                    name: 'video.mp4',
                } as any);
            }

            formData.append('quality', 'high');
            formData.append('scanMode', 'object');

            // Revert to localhost for consistency
            const uploadResponse = await fetch("http://localhost:4000/uploads", {
                method: "POST",
                body: formData,
            });

            const data = await uploadResponse.json();

            if (uploadResponse.ok && data.jobId) {
                router.replace({ pathname: '/monitor', params: { jobId: data.jobId } });
            } else {
                alert("Erreur upload: " + (data.error || "Inconnue"));
                setUploading(false);
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert("Erreur de connexion au serveur (Blob ou Backend)");
            setUploading(false);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Préparation</Text>
            </View>

            <Text style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>
                Aperçu vidéo désactivé pour test upload
            </Text>
            {/*
            <View style={styles.videoContainer}>
                {videoUri ? (
                    <Text style={{color:'white'}}>Video hidden</Text>
                ) : (
                    <Text style={{ color: 'white' }}>No Video Selected</Text>
                )}
            </View>
            */}

            <View style={styles.footer}>
                <TouchableOpacity onPress={() => router.back()} style={styles.cancelBtn}>
                    <Text style={styles.cancelText}>Annuler</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleUpload} style={styles.uploadBtn} disabled={uploading}>
                    {uploading ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <ActivityIndicator color="white" size="small" />
                            <Text style={[styles.uploadText, { marginLeft: 10 }]}>Envoi...</Text>
                        </View>
                    ) : (
                        <Text style={styles.uploadText}>Scanner (3D)</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.navBar,
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    videoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    footer: {
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingBottom: 20,
        backgroundColor: Colors.navBar,
    },
    cancelBtn: {
        padding: 15,
    },
    cancelText: {
        color: Colors.textSecondary,
        fontSize: 16,
    },
    uploadBtn: {
        backgroundColor: Colors.accentBlue,
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
    },
    uploadText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
