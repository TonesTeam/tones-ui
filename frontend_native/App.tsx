import 'react-native-gesture-handler';
import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppStack } from './navigation/AppStack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './state/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LogBox } from 'react-native';
import { GluestackUIProvider } from './components/ui/gluestack-ui-provider';
import { UserProvider } from './contexts/UserContext';

export default function App() {
    // Ignore specific warning by message
    LogBox.ignoreLogs(['Require cycle:']);
    const [fontsLoaded, fontError] = useFonts({
        'Roboto-thin': require('./assets/fonts/Roboto-Light.ttf'),
        'Roboto-regular': require('./assets/fonts/Roboto-Regular.ttf'),
        'Roboto-bold': require('./assets/fonts/Roboto-Bold.ttf'),
        Newsreader: require('./assets/fonts/Newsreader.ttf'),
        Orbitron: require('./assets/fonts/Orbitron-VariableFont_wght.ttf'),
        'Orbitron-Medium': require('./assets/fonts/orbitron-medium.ttf'),
        'Manrope-Light': require('./assets/fonts/Manrope-Light.ttf'),
        'Manrope-Medium': require('./assets/fonts/Manrope-Medium.ttf'),
        'Manrope-SemiBold': require('./assets/fonts/Manrope-SemiBold.ttf'),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
            setTimeout(() => {
                SplashScreen.hideAsync();
            }, 2000);
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <NavigationContainer>
                        <SafeAreaProvider>
                            <SafeAreaView style={{ flex: 1 }}>
                                <GluestackUIProvider mode="light">
                                    <UserProvider>
                                        <AppStack />
                                    </UserProvider>
                                </GluestackUIProvider>
                            </SafeAreaView>
                        </SafeAreaProvider>
                    </NavigationContainer>
                </GestureHandlerRootView>
            </PersistGate>
        </Provider>
    );
}
