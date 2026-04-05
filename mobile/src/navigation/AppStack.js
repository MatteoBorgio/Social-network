/**
 * File for the routes that handles the main screens for the app
 */

import { View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons'; 

import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import SettingsIcon from "../components/SettingsIcon";
import CreatePost from "../screens/CreatePost";
import ChangeProfileScreen from "../screens/ChangeProfileScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
import MyPostsScreen from "../screens/MyPostsScreen.js";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Placeholder for not implemented screens
const PlaceholderScreen = ({ route }) => {
    return (
        <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>Schermata in arrivo:</Text>
            <Text style={styles.placeholderTitle}>{route.name}</Text>
        </View>
    );
};

// function for managing all Tabs in the application
function Tabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Cerca') {
                        iconName = focused ? 'search' : 'search-outline';
                    } else if (route.name === 'Notifiche') {
                        iconName = focused ? 'heart' : 'heart-outline';
                    } else if (route.name === 'Messaggi') {
                        iconName = focused ? 'chatbubble' : 'chatbubble-outline';
                    } else if (route.name === 'Profilo') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#050505',
                tabBarInactiveTintColor: '#65676B',
                tabBarShowLabel: false, 
            })}
        >
            <Tab.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{ headerRight: () => <SettingsIcon /> }} 
            />

            <Tab.Screen name="Cerca" component={PlaceholderScreen} />
            <Tab.Screen name="Notifiche" component={PlaceholderScreen} />
            <Tab.Screen name="Messaggi" component={PlaceholderScreen} />

            <Tab.Screen name="Profilo" component={MyPostsScreen} />
        </Tab.Navigator>
    );
}

export default function AppStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Tabs" 
                component={Tabs} 
                options={{ headerShown: false }} 
            />

            <Stack.Screen name="Settings" component={SettingsScreen} options={{
                title: "Settings",
                headerShown: true
            }} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{
                title: "ChangePassword",
                headerTitle: "",
                headerShown: true
            }} />
            <Stack.Screen name="CreatePost" component={CreatePost} options={{
                title: "CreatePost",
                headerTitle: "",
                headerShown: true,
                presentation: 'modal'
            }} />
            <Stack.Screen name="ChangeProfile" component={ChangeProfileScreen} options={{
                title: "ChangeProfile",
                headerTitle: "",
                headerShown: true
            }} />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F2F5',
    },
    placeholderText: {
        fontSize: 16,
        color: '#65676B',
        marginBottom: 8,
    },
    placeholderTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#050505',
    }
});
