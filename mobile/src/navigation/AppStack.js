import {createNativeStackNavigator} from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import LogoutButton from "../components/LogoutButton"

const Stack = createNativeStackNavigator()

export default function AppStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name={"Home"} component={HomeScreen} options={{
                title: "Home",
                headerShown: true,
                headerRight: () => <LogoutButton />
            }}></Stack.Screen>
        </Stack.Navigator>
    )
}