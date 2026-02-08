import {useContext, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {Button, StyleSheet, Text, TextInput, View} from "react-native";
import axios from "axios";
import {UserContext} from "../context/UserContext";

export default function SignupScreen(){
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState({})
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const validateForm = () => {
        let errors = {}
        if (!username) {
            errors.username = "Username is required"
        }
        if (!password) {
            errors.password = "Password is required"
        }
        if (!email) {
            errors.email = "Email is required"
        }

        setErrors(errors)

        return Object.keys(errors).length === 0;
    }

    const handleSubmit = () => {
        if (validateForm()) {

        }
    }

    const { loginUser } = useContext(UserContext);

    return (
        <SafeAreaView styles={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.text}>Username</Text>
                <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    placeholder={"Inserisci il tuo username"}
                    autoCapitalize={"none"}
                    autoCorrect={false}
                />
                <Text style={styles.text}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder={"example@gmail.com"}
                    autoCapitalize={"none"}
                    autoCorrect={false}
                />
                <Text style={styles.text}>Password</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder={"Inserisci una password"}
                    autoCapitalize={"none"}
                    autoCorrect={false}
                    secureTextEntry={true}
                />
                <Button title={"Submit"} onPress={handleSubmit} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "white"
    },
    container: {
        flex: 1
    }
})