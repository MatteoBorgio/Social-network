/**
 * File for the screen that handles the creation of a new post
 * from a verified user
 * Renders a form which takes a title, a description
 * and a post image (using Image Picker)
 */

import React, { useContext, useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    View,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserContext } from "../context/UserContext";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { SERVER_URL } from "../../config/config.js";

export default function CreatePost({ navigation }) {
    const { user } = useContext(UserContext);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [postImage, setPostImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const pickImage = async () => {
        let permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.granted === false) {
            Alert.alert("Permesso negato", "Serve il permesso per accedere alla galleria.");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setPostImage(result.assets[0]);
        }
    };

    const handleCreatePost = async () => {
        if (!description.trim() && !postImage && !title.trim()) {
            Alert.alert("Errore", "Non puoi pubblicare un post vuoto!");
            return;
        }

        setIsLoading(true);
        const formData = new FormData();

        if (title) formData.append('title', title);
        if (description) formData.append('description', description);

        // saves the picture in a local directory named uploads
        if (postImage) {
            const uri = postImage.uri;
            const fileName = uri.split('/').pop() || `post_${Date.now()}.jpg`;
            const fileType = postImage.mimeType || 'image/jpeg';

            formData.append('image', {
                uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
                name: fileName,
                type: fileType,
            });
        }

        try {
            const cleanUrl = SERVER_URL.endsWith('/') ? `${SERVER_URL}post/create` : `${SERVER_URL}/post/create`;

            const response = await axios.post(cleanUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${user?.token}`
                },
            });

            if (response.data.success) {
                setTitle("");
                setDescription("");
                setPostImage(null);
                navigation.reset({
                    index: 0,
                    routes: [{ name: "Tabs" }],
                });
            }
        } catch (error) {
            let errorMsg = error.response?.data?.message || "Errore durante la creazione del post.";
            Alert.alert("Errore", errorMsg);
            console.log("Errore post:", errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">

                    <Text style={styles.headerTitle}>Crea un nuovo post</Text>
                    <Text style={styles.subHeader}>Condividi i tuoi pensieri o una foto con i tuoi amici.</Text>

                    <View style={styles.formContainer}>

                        <TouchableOpacity onPress={pickImage} style={styles.imageBox}>
                            {postImage ? (
                                <View style={{ width: '100%', height: '100%' }}>
                                    <Image source={{ uri: postImage.uri }} style={styles.previewImage} resizeMode="cover" />
                                    <TouchableOpacity
                                        style={styles.removeImageBtn}
                                        onPress={() => setPostImage(null)}
                                    >
                                        <Text style={styles.removeImageText}>X</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.placeholderContent}>
                                    <Text style={styles.placeholderIcon}>📸</Text>
                                    <Text style={styles.placeholderText}>Tocca per aggiungere un'immagine</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        <Text style={styles.label}>Titolo (opzionale)</Text>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Dai un titolo al tuo post..."
                            placeholderTextColor="#aaa"
                        />

                        <Text style={styles.label}>Descrizione</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="A cosa stai pensando?"
                            placeholderTextColor="#aaa"
                            multiline={true}
                            numberOfLines={4}
                        />

                        <View style={styles.buttonContainer}>
                            {isLoading ? (
                                <ActivityIndicator size="large" color="#0064E0" />
                            ) : (
                                <TouchableOpacity style={styles.primaryButton} onPress={handleCreatePost}>
                                    <Text style={styles.primaryButtonText}>Pubblica Post</Text>
                                </TouchableOpacity>
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
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1c1e21',
        marginBottom: 5,
    },
    subHeader: {
        fontSize: 15,
        color: '#65676B',
        marginBottom: 25,
    },
    formContainer: {
        width: '100%',
    },
    imageBox: {
        width: '100%',
        height: 250,
        backgroundColor: '#F5F6F7',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        marginBottom: 20,
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    placeholderContent: {
        alignItems: 'center',
    },
    placeholderIcon: {
        fontSize: 40,
        marginBottom: 10,
    },
    placeholderText: {
        color: '#8A8D91',
        fontSize: 16,
    },
    removeImageBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeImageText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#F5F6F7',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        color: '#000',
        marginBottom: 20,
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    buttonContainer: {
        marginTop: 10,
        marginBottom: 40,
    },
    primaryButton: {
        backgroundColor: '#0064E0',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
