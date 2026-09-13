import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const MOCK_CLIENTS = [
    { id: 1, name: 'Jean Dupont', email: 'jean.dupont@dupont.fr', company: 'Dupont Rénovation', status: 'Actif', total: '12,450 €' },
    { id: 2, name: 'Marie Curie', email: 'marie@curie.fr', company: 'Sciences Déco', status: 'En Attente', total: '3,200 €' },
    { id: 3, name: 'Pierre Martin', email: 'martin@btp.com', company: 'BTP Martin', status: 'Inactif', total: '0 €' },
    { id: 4, name: 'Alice Durand', email: 'alice@design.io', company: 'Design Pro', status: 'Actif', total: '1,150 €' },
];

export default function ClientsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [search, setSearch] = useState('');

    const filteredClients = MOCK_CLIENTS.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase()) || 
        c.company.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Actif': return '#4CAF50';
            case 'En Attente': return '#FF9800';
            case 'Inactif': return '#F44336';
            default: return Colors.textSecondary;
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Sidebar Navigation simulation (since it's a mobile app, we use a simple header or tab) */}
            <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                    <Text style={styles.title}>Vos Clients</Text>
                    <TouchableOpacity style={styles.newClientBtn}>
                        <Text style={styles.newClientBtnText}>Nouveau Client</Text>
                        <Ionicons name="add" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Search Bar matching Image 3 */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color={Colors.textSecondary} />
                    <TextInput 
                        style={styles.searchInput}
                        placeholder="Rechercher un client..."
                        placeholderTextColor={Colors.textSecondary}
                        value={search}
                        onChangeText={setSearch}
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => setSearch('')}>
                            <Ionicons name="close-circle" size={18} color={Colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.filterRow}>
                    <Text style={styles.filterLabel}>Statut:</Text>
                    <TouchableOpacity style={styles.filterDropdown}>
                        <Text style={styles.filterValue}>Tous</Text>
                        <Ionicons name="chevron-down" size={14} color={Colors.textSecondary} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} horizontal={false}>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>CLIENT</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>ENTREPRISE</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>STATUT</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>TOTAL</Text>
                </View>

                {filteredClients.map((client) => (
                    <TouchableOpacity key={client.id} style={styles.clientRow}>
                        {/* Client Info with Avatar */}
                        <View style={styles.clientInfoCell}>
                            <View style={[styles.avatar, { backgroundColor: Colors.accentBlue }]}>
                                <Text style={styles.avatarText}>{client.name.charAt(0)}</Text>
                            </View>
                            <View>
                                <Text style={styles.clientName}>{client.name}</Text>
                                <Text style={styles.clientEmail} numberOfLines={1}>{client.email}</Text>
                            </View>
                        </View>

                        {/* Company */}
                        <Text style={styles.companyCell}>{client.company}</Text>

                        {/* Status */}
                        <View style={styles.statusCell}>
                            <Text style={[styles.statusText, { color: getStatusColor(client.status) }]}>{client.status}</Text>
                        </View>

                        {/* Total */}
                        <Text style={styles.totalCell}>{client.total}</Text>

                        {/* Action icon (dots) */}
                        <Ionicons name="ellipsis-vertical" size={16} color={Colors.textSecondary} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        padding: 20,
        backgroundColor: Colors.background,
    },
    headerTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    newClientBtn: {
        flexDirection: 'row',
        backgroundColor: Colors.accentBlue,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    newClientBtnText: {
        color: 'white',
        fontWeight: 'bold',
        marginRight: 5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    searchInput: {
        flex: 1,
        color: Colors.textPrimary,
        marginLeft: 10,
        fontSize: 16,
    },
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    filterLabel: {
        color: Colors.textSecondary,
        fontSize: 14,
        marginRight: 5,
    },
    filterDropdown: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterValue: {
        color: Colors.textPrimary,
        fontSize: 14,
        marginRight: 4,
    },
    scrollContent: {
        paddingHorizontal: 10,
        paddingBottom: 100,
    },
    tableHeader: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    tableHeaderText: {
        color: Colors.textSecondary,
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    clientRow: {
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 10,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    clientInfoCell: {
        flex: 1.5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    avatarText: {
        color: 'white',
        fontWeight: 'bold',
    },
    clientName: {
        color: Colors.textPrimary,
        fontSize: 14,
        fontWeight: '600',
    },
    clientEmail: {
        color: Colors.textSecondary,
        fontSize: 11,
        maxWidth: 100,
    },
    companyCell: {
        flex: 1.5,
        color: Colors.textPrimary,
        fontSize: 13,
    },
    statusCell: {
        flex: 1,
        alignItems: 'center',
    },
    statusText: {
        fontSize: 12,
        fontStyle: 'italic',
    },
    totalCell: {
        flex: 1,
        color: Colors.textPrimary,
        fontSize: 14,
        textAlign: 'right',
        marginRight: 5,
    },
});
