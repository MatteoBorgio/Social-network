/**
 * File for the routes that handles the main screens for the app
 */

import {createNativeStackNavigator} from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import SettingsIcon from "../components/SettingsIcon";
import CreatePost from "../screens/CreatePost";
import ChangeProfileScreen from "../screens/ChangeProfileScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
import MyPostsScreen from "../screens/MyPostsScreen.js"

const Stack = createNativeStackNavigator()

export default function AppStack() {
    return (
        // for this stack, the headers are all shown
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
            <Stack.Screen name={"ChangePassword"} component={ChangePasswordScreen} options={{
                title: "ChangePassword",
                headerTitle: "",
                headerShown: true
            }}></Stack.Screen>
            <Stack.Screen name={"CreatePost"} component={CreatePost} options={{
                title: "CreatePost",
                headerTitle: "",
                headerShown: true
            }}></Stack.Screen>
            <Stack.Screen name={"ChangeProfile"} component={ChangeProfileScreen} options={{
                title: "ChangeProfile",
                headerTitle: "",
                headerShown: true
            }}></Stack.Screen>
            <Stack.Screen name={"MyPosts"} component={MyPostsScreen} options={{
                title: "MyPosts",
                headerTitle: "",
                headerShown: true
            }}></Stack.Screen>
        </Stack.Navigator>
    )
}
