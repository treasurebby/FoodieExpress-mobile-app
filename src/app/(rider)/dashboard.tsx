import { Colors } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

export default function RiderDashboard() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rider Dashboard</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
});
