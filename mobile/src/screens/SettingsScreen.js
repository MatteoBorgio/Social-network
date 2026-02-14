import {View, StyleSheet} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import LogoutButton from "../components/LogoutButton";

export default function SettingsScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <LogoutButton />
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
    }
})