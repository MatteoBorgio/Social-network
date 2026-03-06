import { useEffect, useContext } from "react";
import { View, StyleSheet } from "react-native";
import { UserContext } from "../context/UserContext";
import Posts from "../components/Posts";
import CreatePostIcon from "../components/CreatePostIcon";

export default function HomeScreen({ navigation }) {
    const { user } = useContext(UserContext);

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
            <CreatePostIcon />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F2F5',
    }
});