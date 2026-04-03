/**
 * File for page that displays all user posts
 * Request all the users posts and renders them, 
 * if the user is verified
 */

import { useEffect, useContext } from "react";
import {View, StyleSheet, TouchableOpacity} from "react-native";
import { UserContext } from "../context/UserContext";
import MyPosts from "../components/MyPosts";
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
            <MyPosts />
            <CreatePostIcon />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F2F5',
    },
});
