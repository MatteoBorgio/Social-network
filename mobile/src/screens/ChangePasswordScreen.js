import {ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import React, {useState} from "react";

export default function ChangePasswordScreen() {
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [errors, setErrors] = useState({})
    const [submitted, setSubmitted] = useState(false)

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.headerTitle}>Modifica la tua password</Text>
                <View style={styles.formContainer}>
                    <Text style={styles.label}>
                        Imposta la tua password attuale
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
                    />
                    {submitted && errors.oldPassword && <Text style={styles.errorText}>{errors.oldPassword}</Text>}
                    <Text style={styles.label}></Text>
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
    }
});