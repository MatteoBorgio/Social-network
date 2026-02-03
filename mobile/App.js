import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import api from './src/services/api'; // Importiamo la nostra configurazione

export default function App() {

    const testConnection = async () => {
        try {
            const response = await api.get('/');

            Alert.alert("SUCCESSO! 🎉", "Il server ha risposto: " + response.status);
            console.log("Risposta server:", response.data);

        } catch (error) {
            if (error.response) {
                Alert.alert("CONNESSO! ✅", "Il server ha risposto (anche se con errore): " + error.response.status);
            } else if (error.request) {
                Alert.alert("ERRORE DI RETE ❌", "Impossibile raggiungere il server. Controlla IP e Firewall.");
                console.error("Errore di rete:", error);
            } else {
                Alert.alert("ERRORE GENERICO", error.message);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Test Connessione Server</Text>
            <Text style={styles.subtext}>Assicurati che il server Node sia avviato!</Text>

            <View style={styles.buttonContainer}>
                <Button title="TEST CONNESSIONE" onPress={testConnection} />
            </View>

            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtext: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 200,
    }
});