import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.logoWrap}>
                <Image source={require('../../logo.jpg')} style={styles.logoImage} resizeMode="cover" />
            </View>
            <Text style={styles.title}>FoodExpress</Text>
            <Text style={styles.subtitle}>Login to continue</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => router.replace('/(user)/home')}
            >
                <Text style={styles.buttonText}>Login as User</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => router.replace('/(vendor)/dashboard')}
            >
                <Text style={styles.buttonText}>Login as Vendor</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#004d40', // dark green background
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#E0F2F1',
        marginBottom: 40,
    },
    button: {
        backgroundColor: '#FFA726', // warm light orange to pop on dark green
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
        marginBottom: 15,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 3,
    },
    secondaryButton: {
        backgroundColor: '#80E27E', // soft mint green harmonious with background
        borderWidth: 0,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    logoWrap: {
        width: 110,
        height: 110,
        borderRadius: 60,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.14,
        shadowRadius: 12,
        elevation: 6,
    },
    logoImage: {
        width: 86,
        height: 86,
        borderRadius: 16,
    },
});
