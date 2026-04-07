/**
 * File for the screen that handles the changing password process
 * from a verified user
 * Renders a form which takes the old password and the new
 * Need a valid user token
 */

import {ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import React, {useContext, useState} from "react";
import axios from "axios";
import {UserContext} from "../context/UserContext";
import { SERVER_URL } from "../../config/config.js";

export default function ChangePasswordScreen({ navigation }) {
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [errors, setErrors] = useState({})
    const [submitted, setSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const { loginUser, token } = useContext(UserContext)

    const validateForm = () => {
        let newErrors = {};

        if (!oldPassword) newErrors.oldPassword = "Vecchia password richiesta";
        if (!newPassword) newErrors.newPassword = "Nuova password richiesta";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async () => {
        setSubmitted(true);
        if (validateForm()) {
            try {
                setIsLoading(true)

                const response = await axios.patch(
                    `${SERVER_URL}/auth/change-password`,
                    { oldPassword, newPassword },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                // redirect not directly to the home, but to the latest app routes opened
                if (response.data.success) {
                    Alert.alert("Password modificata con successo!");
                    loginUser(response.data.updatedUser)
                    navigation.reset({
                        index: 0,
                        routes: [{name: "App"}],
                    });
                }
            } catch (error) {
                console.log("Error: " + error)
                const msg = error.response?.data?.message || "Errore di connessione";
                Alert.alert("Errore", msg);
            }
            finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.headerTitle}>Modifica la tua password</Text>
                <View style={styles.formContainer}>
                    <Text style={styles.label}>
                        Password attuale
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            (submitted && errors.oldPassword) && styles.inputError
                        ]}
                        value={oldPassword}
                        onChangeText={(text) => {
                            setOldPassword(text)
                            if (submitted) setErrors({...errors, oldPassword: null});
                        }}
                        placeholder={"Inserisci la tua vecchia password"}
                        placeholderTextColor="#aaa"
                        autoCapitalize="none"
                        autoCorrect={false}
                        secureTextEntry={true}
                    />
                    {submitted && errors.oldPassword && <Text style={styles.errorText}>{errors.oldPassword}</Text>}
                    <Text style={styles.label}>
                        Nuova password
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            (submitted && errors.newPassword) && styles.inputError
                        ]}
                        value={newPassword}
                        onChangeText={(text) => {
                            setNewPassword(text)
                            if (submitted) setErrors({...errors, newPassword: null})
                        }}
                        placeholder={"Inserisci la nuova password"}
                        placeholderTextColor="#aaa"
                        autoCapitalize="none"
                        autoCorrect={false}
                        secureTextEntry={true}
                    />
                    {submitted && errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}
                    <View style={styles.buttonContainer}>
                        {isLoading ? (
                            <ActivityIndicator size="large" color="#0064E0" />
                        ) : (
                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={handleSubmit}
                            >
                                <Text style={styles.primaryButtonText}>Modifica la password</Text>
                            </TouchableOpacity>
                        )
                        }
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1c1e21',
        textAlign: 'center',
        marginBottom: 40,
    },
    formContainer: {
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        height: 50,
        backgroundColor: '#F5F6F7',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#000',
        marginBottom: 15,
    },
    inputError: {
        borderColor: '#FF3B30',
        backgroundColor: '#FFF0F0',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: -10,
        marginBottom: 15,
        marginLeft: 4,
        fontWeight: '500'
    },
    buttonContainer: {
        marginTop: 30,
    },
    primaryButton: {
        backgroundColor: '#0064E0',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        elevation: 2,
    },

    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    }
});
