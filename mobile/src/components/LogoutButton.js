import {Alert, TouchableOpacity, StyleSheet} from "react-native";
import {useContext} from "react";
import {UserContext} from "../context/UserContext";
import {MaterialIcons} from "@expo/vector-icons";

export default function LogoutButton() {
    const { logoutUser } = useContext(UserContext)

    const logout = async () => {
        await logoutUser()
    }

    const handleLogout = () => {
        Alert.alert(
            "Conferma Logout",
            "Sei sicuro di voler uscire?",
            [
                { text: "Annulla", style: "cancel" },
                {
                    text: "Esci",
                    style: "destructive",
                    onPress: () => {
                        try {
                            logout();
                            console.log("Logout completato correttamente");
                        } catch (error) {
                            console.error("Errore durante il logout:", error);
                            Alert.alert("Errore", "Impossibile completare il logout.");
                        }
                    }
                }
            ],
            { cancelable: true }
        );
    }

    return (
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <MaterialIcons name="logout" size={28} color="#FF3B30" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        marginRight: 15,
    },
});