import 'react-native-gesture-handler';
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
import { config } from '@gluestack-ui/config';
import { GluestackUIProvider } from '@gluestack-ui/themed';

export default function App() {
    // Ignore specific warning by message
    LogBox.ignoreLogs(['Require cycle:']);
    const [fontsLoaded, fontError] = useFonts({
        'Roboto-thin': require('./assets/fonts/Roboto-Light.ttf'),
        'Roboto-regular': require('./assets/fonts/Roboto-Regular.ttf'),
        'Roboto-bold': require('./assets/fonts/Roboto-Bold.ttf'),
        Newsreader: require('./assets/fonts/Newsreader-VariableFont_opsz,wght.ttf'),
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
                                <GluestackUIProvider config={config}>
                                    <AppStack />
                                </GluestackUIProvider>
                            </SafeAreaView>
                        </SafeAreaProvider>
                    </NavigationContainer>
                </GestureHandlerRootView>
            </PersistGate>
        </Provider>
    );
}
