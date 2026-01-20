import { useAuth } from '@/contexts/AuthContext';
import { Redirect } from 'expo-router';

export default function Index() {
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) {
        // You can add a splash screen here
        return null;
    }

    if (!isAuthenticated) {
        return <Redirect href="/(auth)/roles" />;
    }

    // Redirect based on user role
    if (user?.role === 'vendor') {
        return <Redirect href="/(vendor)/dashboard" />;
    } else if (user?.role === 'rider') {
        return <Redirect href="/(rider)/dashboard" />;
    }

    return <Redirect href="/(user)/home" />;
}
