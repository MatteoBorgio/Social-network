import {
    ActivityIndicator, Alert, Button,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput, TouchableOpacity,
    View
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {UserContext} from "../context/UserContext";

export default function SigninScreen({ navigation }) {
    const { user, loginUser, isLoading: isContextLoading } = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            navigation.reset({
                index: 0,
                routes: [{ name: "App" }],
            });
        }
    }, [user]);

    if (isContextLoading) {
        return (
            <View style={styles.scrollContainer}>
                <ActivityIndicator size="large" color="#0064E0" />
            </View>
        );
    }

    if (user) return null

    const validateForm = () => {
        let newErrors = {};

        if (!email) newErrors.email = "Email richiesta";
        if (!password) newErrors.password = "Password richiesta";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        setSubmitted(true);

        if (validateForm()) {
            try {
                setIsLoading(true)
                const response = await axios.post(
                    'http://192.168.1.6:5000/api/auth/signin',

                    { email, password }
                );

                if (response.data.success) {
                    Alert.alert("Accesso effettuato con successo!");
                    await loginUser({
                        ...response.data.result,
                        token: response.data.token
                    })
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "App" }],
                    });
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
    }

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
                    <Text style={styles.headerTitle}>Accedi</Text>

                    <View style={styles.formContainer}>
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
                            placeholder="Inserisci la tua password"
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
                                <>
                                    <TouchableOpacity
                                        style={styles.primaryButton}
                                        onPress={handleSubmit}
                                    >
                                        <Text style={styles.primaryButtonText}>Accedi</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.secondaryButton}
                                        onPress={() => navigation.navigate('Signup')}
                                    >
                                        <Text style={styles.secondaryButtonText}>
                                            Non hai un account? Registrati
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.secondaryButton}
                                        onPress={() => navigation.navigate("SendVerificationCode")}
                                    >
                                        <Text style={styles.secondaryButtonText}>
                                            Invia codice di verifica
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
    },

    secondaryButton: {
        borderWidth: 1.5,
        borderColor: '#0064E0',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15
    },

    secondaryButtonText: {
        color: '#0064E0',
        fontSize: 15,
        fontWeight: '600',
    },
});