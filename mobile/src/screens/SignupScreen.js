import React, { useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, Button, StyleSheet, Text, TextInput, View, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { UserContext } from "../context/UserContext";
import axios from "axios";

export default function SignupScreen({ navigation }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        let newErrors = {};

        if (!username) newErrors.username = "Username richiesto";
        if (!email) newErrors.email = "Email richiesta";
        if (!password) newErrors.password = "Password richiesta";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        setSubmitted(true);

        if (validateForm()) {
            setIsLoading(true);
            try {
                const response = await axios.post(
                    'http://192.168.1.6:5000/api/auth/signup',
                    { username, email, password }
                );

                if (response.data.success) {
                    Alert.alert(
                        "Successo",
                        "Account creato con successo! Ora effettua il login.",
                        [
                            {
                                text: "OK",
                                onPress: () => navigation.navigate('Signin')
                            }
                        ]
                    );
                }

            } catch (error) {
                console.log("Errore Signup:", error);

                let errorMsg = "Si è verificato un errore di connessione";

                if (error.response) {
                    errorMsg = error.response.data.message;
                } else if (error.request) {
                    errorMsg = "Impossibile contattare il server. Controlla il tuo IP e che il server Node sia attivo.";
                }

                Alert.alert("Errore", errorMsg);

            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={styles.headerTitle}>Crea Account</Text>

                    <View style={styles.formContainer}>

                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={[
                                styles.input,
                                (submitted && errors.username) && styles.inputError
                            ]}
                            value={username}
                            onChangeText={(text) => {
                                setUsername(text);
                                if (submitted) setErrors({...errors, username: null});
                            }}
                            placeholder="Inserisci il tuo username"
                            placeholderTextColor="#aaa"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        {submitted && errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={[
                                styles.input,
                                (submitted && errors.email) && styles.inputError
                            ]}
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                if (submitted) setErrors({...errors, email: null});
                            }}
                            placeholder="example@gmail.com"
                            placeholderTextColor="#aaa"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        {submitted && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={[
                                styles.input,
                                (submitted && errors.password) && styles.inputError
                            ]}
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                if (submitted) setErrors({...errors, password: null});
                            }}
                            placeholder="Inserisci una password"
                            placeholderTextColor="#aaa"
                            autoCapitalize="none"
                            autoCorrect={false}
                            secureTextEntry={true}
                        />
                        {submitted && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                        <View style={styles.buttonContainer}>
                            {isLoading ? (
                                <ActivityIndicator size="large" color="#0064E0" />
                            ) : (
                                <View>
                                    <Button title="Registrati" onPress={handleSubmit} color="#0064E0"/>
                                    <Button title={"Hai già un account? Accedi"} onPress={() => { navigation.navigate('Signin')}} />
                                </View>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
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
        marginTop: 20,
        borderRadius: 12,
        overflow: 'hidden',
    }
});