import { useEffect, useContext } from "react";
import {Button, Text, StyleSheet, Platform, KeyboardAvoidingView, ScrollView} from "react-native";
import { UserContext } from "../context/UserContext";
import {SafeAreaView} from "react-native-safe-area-context";

export default function HomeScreen({ navigation }) {
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (!user) {
            navigation.reset({
                index: 0,
                routes: [{ name: "Auth", params: { screen: "Signup" } }],
            });
        }
    }, [user]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView style={styles.scrollContainer}>
                    <Text>Home Page</Text>
                    <Button
                        title="Vai al login"
                        onPress={() =>
                            navigation.navigate("Auth", { screen: "Signin" })
                        }
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    scrollContainer: {
        flex: 1
    }
})