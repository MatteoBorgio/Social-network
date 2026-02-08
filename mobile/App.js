import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UserProvider } from "./src/context/UserContext";
import RootNavigator from "./src/navigation/RouteNavigator";

export default function App() {
    return (
        <SafeAreaProvider>
            <UserProvider>
                <NavigationContainer>
                    <RootNavigator />
                </NavigationContainer>
            </UserProvider>
        </SafeAreaProvider>
    );
}