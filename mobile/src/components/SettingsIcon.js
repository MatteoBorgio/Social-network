import {StyleSheet, TouchableOpacity} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";

export default function SettingsIcon() {
    const navigation = useNavigation()
    return (
        <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Settings")}
        >
            <MaterialIcons name={"settings"} size={28} color={"grey"}></MaterialIcons>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        marginRight: 15,
    },
});