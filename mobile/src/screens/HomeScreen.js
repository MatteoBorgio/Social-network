/**
 * File for the Home page
 * Request all the posts and renders them, if the user is verified
 * Show all the routing options for the user
 */

import { useEffect, useContext } from "react";
import {View, StyleSheet, TouchableOpacity} from "react-native";
import { UserContext } from "../context/UserContext";
import Posts from "../components/Posts";
import CreatePostIcon from "../components/CreatePostIcon";

export default function HomeScreen({ navigation }) {
    const { user } = useContext(UserContext);

    // if user doesn't exist, redirect to the signup screen
    useEffect(() => {
        if (!user) {
            navigation.reset({
                index: 0,
                routes: [{ name: "Auth", params: { screen: "Signup" } }],
            });
        }
    }, [user, navigation]);

    return (
        <View style={styles.container}>
            <Posts />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F2F5',
    },
});
