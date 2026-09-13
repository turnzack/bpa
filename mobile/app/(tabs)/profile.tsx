import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
            {/* Profile Header */}
            <View style={styles.profileHeader}>
                <View style={[styles.avatar, { backgroundColor: Colors.accentBlue }]}>
                    <Text style={styles.avatarText}>JD</Text>
                </View>
                <Text style={styles.name}>Jean Dupont</Text>
                <Text style={styles.role}>Artisan Rénovation • Expert IA</Text>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>12</Text>
                    <Text style={styles.statLabel}>Projets</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>84</Text>
                    <Text style={styles.statLabel}>Devis</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>98%</Text>
                    <Text style={styles.statLabel}>Précision IA</Text>
                </View>
            </View>

            {/* Menu Items */}
            <View style={styles.menuContainer}>
                <MenuItem icon="business" title="Mon Entreprise" subtitle="Dupont & Co Rénovation" />
                <MenuItem icon="shield-checkmark" title="Abonnement Premium" subtitle="FactureScan Pro actif" label="PRO" />
                <MenuItem icon="notifications" title="Notifications" />
                <MenuItem icon="color-palette" title="Apparence" subtitle="Mode Sombre" />
                <MenuItem icon="log-out" title="Déconnexion" color="#FF4D4D" />
            </View>

            <Text style={styles.version}>FactureScan v2.4.0 (Autonomous Edition)</Text>
        </View>
    );
}

function MenuItem({ icon, title, subtitle, label, color = Colors.textPrimary }: any) {
    return (
        <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
                <Ionicons name={icon} size={22} color={color === Colors.textPrimary ? Colors.accentBlue : color} />
            </View>
            <View style={styles.menuTextContainer}>
                <Text style={[styles.menuTitle, { color }]}>{title}</Text>
                {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
            </View>
            {label && (
                <View style={styles.tag}>
                    <Text style={styles.tagText}>{label}</Text>
                </View>
            )}
            <Ionicons name="chevron-forward" size={16} color={Colors.iconInactive} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingHorizontal: 20,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 3,
        borderColor: Colors.border,
    },
    avatarText: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
    },
    name: {
        color: Colors.textPrimary,
        fontSize: 22,
        fontWeight: 'bold',
    },
    role: {
        color: Colors.textSecondary,
        fontSize: 14,
        marginTop: 4,
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 20,
        marginBottom: 30,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        color: Colors.textPrimary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    statLabel: {
        color: Colors.textSecondary,
        fontSize: 12,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: Colors.border,
    },
    menuContainer: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 5,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    menuIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#1A1A1A',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    menuTextContainer: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 15,
        fontWeight: '500',
    },
    menuSubtitle: {
        color: Colors.textSecondary,
        fontSize: 12,
        marginTop: 2,
    },
    tag: {
        backgroundColor: Colors.accentBlue + '30',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: 10,
    },
    tagText: {
        color: Colors.accentBlue,
        fontSize: 10,
        fontWeight: 'bold',
    },
    version: {
        textAlign: 'center',
        color: Colors.textSecondary,
        fontSize: 11,
        marginTop: 30,
        opacity: 0.5,
    }
});
