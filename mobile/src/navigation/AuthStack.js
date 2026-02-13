import {SafeAreaProvider} from "react-native-safe-area-context";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import SignupScreen from "../screens/SignupScreen";
import SigninScreen from "../screens/SigninScreen";
import SendVerificationCodeScreen from "../screens/SendVerificationCodeScreen";
import VerifyVerificationCode from "../screens/VerifyVerificationCode";

const Stack = createNativeStackNavigator()

export default function AuthStack() {
    return (
        <SafeAreaProvider>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name={"Signup"} component={SignupScreen}></Stack.Screen>
                <Stack.Screen name={"Signin"} component={SigninScreen}></Stack.Screen>
                <Stack.Screen name={"SendVerificationCode"} component={SendVerificationCodeScreen}></Stack.Screen>
                <Stack.Screen name={"VerifyVerificationCode"} component={VerifyVerificationCode}></Stack.Screen>
            </Stack.Navigator>
        </SafeAreaProvider>
    )
}