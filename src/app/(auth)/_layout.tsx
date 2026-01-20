import { Stack } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const BackButton = () => {
    const router = useRouter();
    return (
        <TouchableOpacity onPress={() => router.back()} style={{ paddingLeft: 16 }}>
            <ChevronLeft size={28} color="#1B5E20" />
        </TouchableOpacity>
    );
};

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ 
            headerShown: true,
            headerStyle: {
                backgroundColor: '#FFFFFF',
            },
            headerTitleStyle: {
                fontWeight: '700',
                fontSize: 18,
            },
            headerShadowVisible: false,
            headerTintColor: '#1B5E20',
        }}>
            <Stack.Screen 
                name="roles" 
                options={{
                    title: '',
                    headerShown: false,
                }}
            />
            <Stack.Screen 
                name="login" 
                options={{
                    title: 'Login',
                    headerLeft: () => <BackButton />,
                }}
            />
            <Stack.Screen 
                name="signup" 
                options={{
                    title: 'Create Account',
                    headerLeft: () => <BackButton />,
                }}
            />
            <Stack.Screen 
                name="rider-signup" 
                options={{
                    title: 'Become a Rider',
                    headerLeft: () => <BackButton />,
                }}
            />
            <Stack.Screen 
                name="vendor-signup" 
                options={{
                    title: 'Register Business',
                    headerLeft: () => <BackButton />,
                }}
            />
            <Stack.Screen 
                name="rider-onboarding" 
                options={{
                    title: '',
                    headerShown: false,
                }}
            />
            <Stack.Screen 
                name="vendor-onboarding" 
                options={{
                    title: '',
                    headerShown: false,
                }}
            />
        </Stack>
    );
}
