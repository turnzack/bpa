import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function SettingsScreen() {
    return (
        <View style={styles.container}>
            <Text style={{ color: 'white' }}>Settings</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
