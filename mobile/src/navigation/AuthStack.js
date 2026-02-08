import {SafeAreaProvider} from "react-native-safe-area-context";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import SignupScreen from "../screens/SignupScreen";

const Stack = createNativeStackNavigator()

export default function AuthStack() {
    return (
        <SafeAreaProvider>
            <Stack.Navigator>
                <Stack.Screen name={"Signup"} component={SignupScreen}></Stack.Screen>
            </Stack.Navigator>
        </SafeAreaProvider>
    )
}