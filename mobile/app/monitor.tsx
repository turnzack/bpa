import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Logger, Log } from '@/services/Logger';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MonitorScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const insets = useSafeAreaInsets();

    const [activeTab, setActiveTab] = useState<'logs' | 'status'>('logs');
    const [logs, setLogs] = useState<Log[]>([]);
    const [stats, setStats] = useState<any>({});
    const [jobStatus, setJobStatus] = useState<any>(null); // For job monitoring

    // Refresh function
    const refresh = async () => {
        setLogs([...Logger.getRecentLogs()]); // New array reference
        setStats(Logger.getStats());

        // Job Processing Status
        if (params.jobId) {
            const jId = params.jobId.toString();

            // Mock simulation for "JOB-XXXX" IDs
            if (jId.startsWith("JOB-")) {
                setJobStatus((prev: any) => {
                    const currentProgress = prev?.progress || 0;
                    if (currentProgress >= 100) return { status: 'done', progress: 100, step: 'Terminé' };
                    return {
                        status: 'running',
                        progress: currentProgress + 10,
                        step: 'Traitement en cours...'
                    };
                });
            } else {
                // Real Backend Polling
                try {
                    const response = await fetch(`http://localhost:4000/jobs/${jId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setJobStatus({
                            status: data.status,
                            progress: data.progress || 0,
                            step: data.step || (data.status === 'done' ? 'Terminé' : 'Traitement en cours...')
                        });
                    }
                } catch (e) {
                    console.error("Failed to fetch job status", e);
                }
            }
        }
    };

    useEffect(() => {
        refresh();
        const interval = setInterval(refresh, 2000);
        return () => clearInterval(interval);
    }, []);

    const getLogColor = (type: string) => {
        switch (type) {
            case 'SUCCESS': return '#33CC33'; // success
            case 'ERROR': return '#E63333'; // error
            case 'WARNING': return '#E6B333'; // warning
            case 'INFO': return '#4DA6FF'; // info
            case 'DEBUG': return '#999999'; // debug
            default: return Colors.textSecondary;
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>📡 Monitoring</Text>
                <TouchableOpacity onPress={refresh} style={styles.refreshBtn}>
                    <Text style={styles.refreshIcon}>🔄</Text>
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity onPress={() => setActiveTab('logs')} style={styles.tabItem}>
                    <Text style={[styles.tabText, activeTab === 'logs' ? styles.activeTab : styles.inactiveTab]}>Logs</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('status')} style={styles.tabItem}>
                    <Text style={[styles.tabText, activeTab === 'status' ? styles.activeTab : styles.inactiveTab]}>Statut</Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {activeTab === 'logs' ? (
                    <ScrollView contentContainerStyle={styles.logsList}>
                        {logs.map((log, index) => (
                            <View key={index} style={styles.logCard}>
                                <View style={[styles.logColorBar, { backgroundColor: getLogColor(log.type) }]} />
                                <View style={styles.logContent}>
                                    <View style={styles.logHeader}>
                                        <Text style={styles.logTime}>{log.timestamp}</Text>
                                        <Text style={[styles.logType, { color: getLogColor(log.type) }]}>{log.type}</Text>
                                    </View>
                                    <Text style={styles.logMessage}>{log.message}</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                ) : (
                    <ScrollView contentContainerStyle={styles.statusContent}>
                        {/* Server Status */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>🌐 Serveur Backend</Text>
                            <Text style={styles.serverValue}>http://192.168.1.148:4000</Text>
                            <Text style={styles.serverStatus}>● Connecté</Text>
                        </View>

                        {/* Stats */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>📊 Statistiques</Text>
                            <Text style={styles.statsText}>
                                {`Total: ${stats.total || 0} logs\n✓ Succès: ${stats.success || 0}  ⚠ Warnings: ${stats.warning || 0}\nℹ Info: ${stats.info || 0}  ✗ Erreurs: ${stats.error || 0}`}
                            </Text>
                        </View>

                        {/* Job Status (Mocked if ID exists) */}
                        {params.jobId && (
                            <View style={styles.card}>
                                <Text style={styles.cardTitle}>🔄 Job en cours</Text>
                                <Text style={styles.jobId}>ID: {params.jobId}</Text>
                                <Text style={[styles.jobStatus, { color: jobStatus?.status === 'done' ? '#33CC33' : '#4DA6FF' }]}>
                                    {jobStatus?.step || "Chargement..."}
                                </Text>

                                {/* Progress Bar */}
                                <View style={styles.progressBarBg}>
                                    <View style={[styles.progressBarFill, { width: `${jobStatus?.progress || 0}%` }]} />
                                </View>
                                <Text style={styles.progressText}>{jobStatus?.progress || 0}%</Text>

                                {jobStatus?.status === 'done' && (
                                    <TouchableOpacity
                                        style={styles.viewBtn}
                                        onPress={() => router.push({ pathname: '/viewer', params: { jobId: params.jobId } })}
                                    >
                                        <Text style={styles.viewBtnText}>Voir le modèle 3D</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </ScrollView>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D0D0D', // Slightly darker than Home
    },
    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        backgroundColor: '#141414',
    },
    backBtn: { padding: 5 },
    backArrow: { fontSize: 24, color: Colors.accentBlue },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
    refreshBtn: { padding: 5 },
    refreshIcon: { fontSize: 20, color: Colors.accentBlue },
    tabContainer: {
        flexDirection: 'row',
        height: 50,
        backgroundColor: '#101010',
    },
    tabItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    activeTab: { color: Colors.accentBlue },
    inactiveTab: { color: Colors.textSecondary },
    content: { flex: 1 },
    logsList: { padding: 10 },
    logCard: {
        flexDirection: 'row',
        backgroundColor: '#1A1A1A',
        borderRadius: 8,
        marginBottom: 10,
        overflow: 'hidden',
        minHeight: 60,
    },
    logColorBar: {
        width: 4,
    },
    logContent: {
        flex: 1,
        padding: 10,
    },
    logHeader: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    logTime: {
        fontSize: 11,
        color: Colors.textSecondary,
        width: 80,
    },
    logType: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    logMessage: {
        color: 'white',
        fontSize: 13,
    },
    statusContent: {
        padding: 20,
    },
    card: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    serverValue: {
        color: '#4DA6FF',
        marginBottom: 5,
    },
    serverStatus: {
        color: '#33CC33',
        fontSize: 12,
    },
    statsText: {
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
    jobId: {
        color: Colors.textSecondary,
        fontSize: 12,
        marginBottom: 5,
    },
    jobStatus: {
        color: '#4DA6FF',
        marginBottom: 10,
    },
    progressBarBg: {
        width: '100%',
        height: 15,
        backgroundColor: '#333',
        borderRadius: 8,
        marginBottom: 5,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#33CC33',
        borderRadius: 8,
    },
    progressText: {
        color: 'white',
        fontWeight: 'bold',
        marginTop: 5,
    },
    viewBtn: {
        marginTop: 20,
        backgroundColor: '#0078FF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    viewBtnText: {
        color: 'white',
        fontWeight: 'bold',
    }
});
