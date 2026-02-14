import {createNativeStackNavigator} from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import SettingsIcon from "../components/SettingsIcon";

const Stack = createNativeStackNavigator()

export default function AppStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name={"Home"} component={HomeScreen} options={{
                title: "Home",
                headerShown: true,
                headerRight: () => <SettingsIcon />
            }}></Stack.Screen>
            <Stack.Screen name={"Settings"} component={SettingsScreen} options={{
                title: "Settings",
                headerShown: true
            }}></Stack.Screen>
        </Stack.Navigator>
    )
}