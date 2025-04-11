import { Stack } from 'expo-router/stack';
import ToastManager from 'toastify-react-native';
import { useColorScheme } from '~/lib/useColorScheme';

export default function Layout() {
  const { isDarkColorScheme, setColorScheme } = useColorScheme();
  return (
    <>
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(detail)" options={{ headerShown: false }} />
      
    </Stack>
    <ToastManager
        style={{
          borderRadius: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
          padding: 4,
        }}
        showProgressBar={false}
        showCloseIcon={false}
        theme={isDarkColorScheme ? 'dark' : 'light'}
      />
      </>
  );
}