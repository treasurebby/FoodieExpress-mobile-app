import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function VendorLogout() {
    const router = useRouter();

    function signOut() {
        // If you persist auth tokens, clear them here before redirecting.
        router.replace('/(auth)/login');
    }

    function cancel() {
        // Go back to previous vendor screen
        router.back();
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign out</Text>
            <Text style={styles.message}>Are you sure you want to sign out?</Text>

            <TouchableOpacity style={[styles.button, styles.signout]} onPress={signOut}>
                <Text style={styles.buttonText}>Sign out</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.cancel]} onPress={cancel}>
                <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#004d40',
        padding: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
    },
    message: {
        color: '#E0F2F1',
        marginBottom: 24,
        textAlign: 'center',
    },
    button: {
        width: '100%',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.14,
        shadowRadius: 12,
        elevation: 6,
    },
    signout: {
        backgroundColor: '#FFA726',
    },
    cancel: {
        backgroundColor: '#80E27E',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
});
