import {Alert, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import React, {useState} from "react";
import axios from "axios";

export default function SendVerificationCodeScreen({navigation}) {
    const [email, setEmail] = useState("")
    const [submitted, setSubmitted] = useState(false)
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const validateForm = () => {
        let newErrors = {};

        if (!email) newErrors.email = "Email richiesta";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        setSubmitted(true)

        if (validateForm()) {
            try {
                setIsLoading(true)
                const response = await axios.patch(
                    'http://192.168.1.6:5000/api/auth/send-verification-code',
                    { email }
                )

                if (response.data.success) {
                    Alert.alert(
                        "Successo",
                        "Codice inviato con successo!",
                        [
                            {
                                text: "OK",
                                onPress: () => navigation.navigate('VerifyVerificationCode')
                            }
                        ]
                    );
                } else {
                     Alert.alert("Attenzione", response.data.message || "Impossibile inviare il codice");
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
                setIsLoading(false)
            }
        }


    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.scrollContainer}>
                <Text style={styles.headerTitle}>Verifica il tuo account</Text>
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
                </View>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => handleSubmit()}
                >
                    <Text style={styles.primaryButtonText}>
                        Invia il codice di verifica
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Signin")}
                    style={styles.secondaryButton}
                >
                    <Text style={styles.secondaryButtonText}>Vai all'accesso</Text>
                </TouchableOpacity>
            </View>
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