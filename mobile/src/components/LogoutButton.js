import {Alert, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, View} from "react-native";
import {useContext, useState} from "react";
import {UserContext} from "../context/UserContext";
import axios from "axios";
import {MaterialIcons} from "@expo/vector-icons";

export default function LogoutButton({ navigation }) {
    const { logoutUser } = useContext(UserContext)
    const [ isLoading, setIsLoading ] = useState(false)

    const logout = async () => {
        try {
            setIsLoading(true)

            const response = await axios.post(
                'http://192.168.1.6:5000/api/auth/signout'
            );

            if (response.data.success) {
                logoutUser()
            }

        } catch (error) {
            console.log("Errore Signout:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleLogout = () => {
        Alert.alert(
            "Conferma Logout",
            "Sei sicuro di voler uscire?",
            [
                { text: "Annulla", style: "cancel" },
                { text: "Esci", style: "destructive", onPress: () => logout() }
            ],
            { cancelable: true }
        );
    }
    return (
        <>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <MaterialIcons name="logout" size={28} color="#FF3B30" />
        </TouchableOpacity>

    {isLoading && (
        <Modal transparent animationType="fade">
            <View style={styles.overlay}>
                <ActivityIndicator size="large" color="#FF3B30" />
            </View>
        </Modal>

    )}
        </>
    );
}

const styles = StyleSheet.create({
    button: {
        marginRight: 15,
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
});