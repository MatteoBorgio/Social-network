/**
 * File for managing the settings
 * Renders a list of the settings and the
 * possible action of the user
 */

import {View, StyleSheet, TouchableOpacity, Text} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import LogoutButton from "../components/LogoutButton";

export default function SettingsScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <LogoutButton />
                <TouchableOpacity onPress={() => navigation.navigate("ChangePassword")}>
                    <Text style={styles.text}>modifica password</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("ChangeProfile")}>
                    <Text style={styles.text}>modifica il tuo profilo</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("MyPosts")}>
                    <Text style={styles.text}>i tuoi post</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    container: {
        color: "",
        flex: 1,
        flexDirection: "column",
        alignItems: "center"
    },
    text: {
        fontSize: 18,
        fontWeight: "bold",
        color: "grey",
        marginTop: 30
    }
})
