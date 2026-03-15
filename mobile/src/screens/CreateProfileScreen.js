/**
 * File for the screen that handles the creation
 * of the profile from a verified user
 * Renders a form which takes a picture from
 * the user gallery (using image picker) and a bio
 */

import React, {useContext, useState} from "react";
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

export default function CreateProfileScreen({ navigation }) {
    const { user, loginUser, isLoading: isContextLoading } = useContext(UserContext);

    const [profilePic, setProfilePic] = useState(null);
    const [bio, setBio] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    if (isContextLoading) {
        return (
            <View style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#0064E0" />
            </View>
        );
    }

    const pickImage = async () => {
        let permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.granted === false) {
            Alert.alert("Permesso negato", "Il permesso di accesso alla galleria è necessario per eseguire questa operazione");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setProfilePic(result.assets[0]);
            if (isSubmitted) setErrors({ ...errors, image: null });
        }
    };

    const validateForm = () => {
        let newErrors = {};

        if (bio.length > 150) newErrors.bio = "La biografia non può superare i 150 caratteri";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const updateProfile = async () => {
        setIsSubmitted(true);

        if (!validateForm()) return;

        setIsLoading(true);
        const formData = new FormData();

        formData.append('desc', bio);

        // saves the pic in a local directory named uploads
        if (profilePic) {
            const uri = profilePic.uri;
            const fileName = uri.split('/').pop() || `profile_${Date.now()}.jpg`;
            const fileType = profilePic.mimeType || 'image/jpeg';

            formData.append('image', {
                uri: uri,
                name: fileName,
                type: fileType,
            });
        }

        try {
            const response = await axios.put('http://192.168.1.6:5000/api/auth/createProfile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${user?.token}`
                },
            });

            if (response.data.success) {
                if (response.data.result) {
                    await loginUser({ ...response.data.result, token: user.token });
                }

                Alert.alert(
                    "Successo",
                    "Profilo aggiornato con successo!",
                    [{
                        text: "OK",
                        onPress: () => navigation.reset({
                            index: 0,
                            routes: [{ name: "App" }],
                        })
                    }]
                );
            }
        } catch (error) {
            let errorMsg = error.response?.data?.message || "Errore durante il salvataggio del profilo";
            Alert.alert("Errore", errorMsg);
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

                    <Text style={styles.headerTitle}>Completa il Profilo</Text>
                    <Text style={styles.subHeader}>Aggiungi una foto e una breve bio per farti conoscere.</Text>

                    <View style={styles.formContainer}>

                        <View style={styles.imageSection}>
                            <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                                {profilePic ? (
                                    <Image source={{ uri: profilePic.uri }} style={styles.profileImage} />
                                ) : (
                                    <View style={styles.placeholderImage}>
                                        <Text style={styles.placeholderText}>+</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={pickImage}>
                                <Text style={styles.changePhotoText}>
                                    {profilePic ? "Cambia Foto" : "Aggiungi Foto"}
                                </Text>
                            </TouchableOpacity>
                            {isSubmitted && errors.image && <Text style={[styles.errorText, {textAlign: 'center'}]}>{errors.image}</Text>}
                        </View>

                        <Text style={styles.label}>Biografia</Text>
                        <TextInput
                            style={[styles.input, styles.textArea, (isSubmitted && errors.bio) && styles.inputError]}
                            value={bio}
                            onChangeText={(text) => {
                                setBio(text);
                                if (isSubmitted) setErrors({ ...errors, bio: null });
                            }}
                            placeholder="Scrivi qualcosa su di te..."
                            placeholderTextColor="#aaa"
                            multiline={true}
                            numberOfLines={4}
                            maxLength={150}
                        />
                        <Text style={styles.charCount}>{bio.length}/150</Text>
                        {isSubmitted && errors.bio && <Text style={styles.errorText}>{errors.bio}</Text>}

                        <View style={styles.buttonContainer}>
                            {isLoading ? (
                                <ActivityIndicator size="large" color="#0064E0" />
                            ) : (
                                <>
                                    <TouchableOpacity style={styles.primaryButton} onPress={updateProfile}>
                                        <Text style={styles.primaryButtonText}>Salva Profilo</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.secondaryButton}
                                        onPress={() => navigation.navigate('Home')}
                                    >
                                        <Text style={styles.secondaryButtonText}>Salta per ora</Text>
                                    </TouchableOpacity>
                                </>
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
        marginTop: 20,
    },
    subHeader: {
        fontSize: 15,
        color: '#65676B',
        textAlign: 'center',
        marginBottom: 35,
        marginTop: 8,
        paddingHorizontal: 10,
    },
    formContainer: {
        width: '100%',
    },
    imageSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    imageContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F5F6F7',
        borderWidth: 2,
        borderColor: '#E5E5E5',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        marginBottom: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E4E6EB',
    },
    placeholderText: {
        fontSize: 40,
        color: '#8A8D91',
        fontWeight: '300',
    },
    changePhotoText: {
        color: '#0064E0',
        fontSize: 16,
        fontWeight: '600',
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
        fontSize: 16,
        color: '#000',
        marginBottom: 5,
    },
    textArea: {
        height: 100,
        paddingTop: 15,
        textAlignVertical: 'top',
    },
    charCount: {
        textAlign: 'right',
        fontSize: 12,
        color: '#8A8D91',
        marginBottom: 15,
        marginRight: 4,
    },
    inputError: {
        borderColor: '#FF3B30',
        backgroundColor: '#FFF0F0',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginBottom: 15,
        marginLeft: 4,
        fontWeight: '500'
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
    },
    secondaryButtonText: {
        color: '#0064E0',
        fontSize: 15,
        fontWeight: '600',
    },
});