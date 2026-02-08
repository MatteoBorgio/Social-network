import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import AuthStack from "./AuthStack";
import AppStack from "./AppStack";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    const { user } = useContext(UserContext);

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="Root"
                component={user ? AppStack : AuthStack}
            />
        </Stack.Navigator>
    );
}