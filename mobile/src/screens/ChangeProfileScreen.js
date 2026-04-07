/**
 * File for the screen that handles the modification
 * of the profile from a verified user
 * Renders the profile of the user and a form
 * to modify the username, bio and profilePic
 */
import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { SERVER_URL, SERVER_URL_IMAGES } from "../../config/config.js";

export default function ChangeProfileScreen({ navigation }) {
    const { user, loginUser, isLoading: isContextLoading } = useContext(UserContext);

    const [newProfilePic, setNewProfilePic] = useState(null);
    const [newDesc, setNewDesc] = useState(user?.desc || "");
    const [newUsername, setNewUsername] = useState(user?.username || "");

    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (user) {
            setNewDesc(user.desc || "");
            setNewUsername(user.username || "");
        }
    }, [user]);

    if (isContextLoading) {
        return (
            <View style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#0064E0" />
            </View>
        );
    }

    const pickNewImage = async () => {
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
            setNewProfilePic(result.assets[0]);
            if (isSubmitted) setErrors({ ...errors, image: null });
        }
    };

    const validateForm = () => {
        let newErrors = {};

        if (newDesc.trim() === "") newErrors.bio = "La biografia non può essere vuota";
        else if (newDesc.length > 150) newErrors.bio = "La biografia non può superare i 150 caratteri";

        if (newUsername.trim() === "") newErrors.username = "L'username non può essere vuoto";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const saveChanges = async () => {
        setIsSubmitted(true);

        if (!validateForm()) return;

        setIsLoading(true);
        let userUpdated = false;
        let currentUserData = { ...user };

        try {
            if (newProfilePic && (!user.profilePicture || newProfilePic.uri !== user.profilePicture)) {
                const formData = new FormData();
                const uri = newProfilePic.uri;
                const fileName = uri.split('/').pop() || `profile_${Date.now()}.jpg`;
                const fileType = newProfilePic.mimeType || 'image/jpeg';

                formData.append('image', {
                    uri,
                    name: fileName,
                    type: fileType
                });

                const response = await axios.patch(`${ SERVER_URL }/auth/change-profile-pic`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${user?.token}`
                    },
                });

                if (response.data.success) {
                    currentUserData = { ...currentUserData, ...response.data.result };
                    userUpdated = true;
                }
            }

            if (newDesc !== (user.desc || "")) {
                const response = await axios.patch(`${ SERVER_URL }/auth/change-bio`, { desc: newDesc }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.token}`
                    },
                });

                if (response.data.success) {
                    currentUserData = { ...currentUserData, ...response.data.result };
                    userUpdated = true;
                }
            }

            if (newUsername !== user.username) {
                const response = await axios.patch(`${ SERVER_URL }/auth/change-username`, { username: newUsername }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.token}`
                    },
                });

                if (response.data.success) {
                    currentUserData = { ...currentUserData, ...response.data.result };
                    userUpdated = true;
                }
            }

            if (userUpdated) {
                await loginUser({ ...currentUserData, token: user.token });
                Alert.alert("Successo", "Profilo aggiornato con successo!",
                    [{
                        text: "OK",
                        onPress: () => navigation.goBack()
                    }]);
            } else {
                Alert.alert("Info", "Nessuna modifica effettuata.");
            }
        } catch (error) {
            console.error("Errore salvataggio:", error);
            let errorMsg = error.response?.data?.message || "Errore di connessione al server";
            Alert.alert("Errore", errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const imageToDisplay = newProfilePic ? { uri: newProfilePic.uri }
        : user?.profilePicture ? { uri: `${ SERVER_URL_IMAGES }/${user.profilePicture.replace(/\\/g, '/')}` }
            : null;

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">

                    <Text style={styles.headerTitle}>Modifica Profilo</Text>

                    <View style={styles.formContainer}>

                        <View style={styles.imageSection}>
                            <TouchableOpacity onPress={pickNewImage} style={styles.imageContainer}>
                                {imageToDisplay ? (
                                    <Image source={imageToDisplay} style={styles.profileImage} />
                                ) : (
                                    <View style={styles.placeholderImage}>
                                        <Text style={styles.placeholderText}>+</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={pickNewImage}>
                                <Text style={styles.changePhotoText}>
                                    {imageToDisplay ? "Cambia Foto" : "Aggiungi Foto"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={[styles.input, (isSubmitted && errors.username) && styles.inputError]}
                            value={newUsername}
                            onChangeText={(text) => {
                                setNewUsername(text);
                                if (isSubmitted) setErrors({ ...errors, username: null });
                            }}
                            placeholder="Il tuo username"
                            placeholderTextColor="#aaa"
                            autoCapitalize="none"
                        />
                        {isSubmitted && errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

                        <Text style={[styles.label, {marginTop: 15}]}>Biografia</Text>
                        <TextInput
                            style={[styles.input, styles.textArea, (isSubmitted && errors.bio) && styles.inputError]}
                            value={newDesc}
                            onChangeText={(text) => {
                                setNewDesc(text);
                                if (isSubmitted) setErrors({ ...errors, bio: null });
                            }}
                            placeholder="Scrivi qualcosa su di te..."
                            placeholderTextColor="#aaa"
                            multiline={true}
                            numberOfLines={4}
                            maxLength={150}
                        />
                        <Text style={styles.charCount}>{newDesc.length}/150</Text>
                        {isSubmitted && errors.bio && <Text style={styles.errorText}>{errors.bio}</Text>}

                        <View style={styles.buttonContainer}>
                            {isLoading ? (
                                <ActivityIndicator size="large" color="#0064E0" />
                            ) : (
                                <>
                                    <TouchableOpacity style={styles.primaryButton} onPress={saveChanges}>
                                        <Text style={styles.primaryButtonText}>Salva Modifiche</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.secondaryButton}
                                        onPress={() => navigation.goBack()}
                                    >
                                        <Text style={styles.secondaryButtonText}>Annulla</Text>
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
        backgroundColor: '#FFFFFF'
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
        justifyContent: 'center'
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1c1e21',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20
    },
    formContainer: {
        width: '100%'
    },
    imageSection: {
        alignItems: 'center',
        marginBottom: 30
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
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    profileImage: {
        width: '100%',
        height: '100%'
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E4E6EB'
    },
    placeholderText: {
        fontSize: 40,
        color: '#8A8D91',
        fontWeight: '300'
    },
    changePhotoText: {
        color: '#0064E0',
        fontSize: 16,
        fontWeight: '600'
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginLeft: 4
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
        paddingVertical: 12
    },
    textArea: {
        height: 100,
        paddingTop: 15,
        textAlignVertical: 'top'
    },
    charCount: {
        textAlign: 'right',
        fontSize: 12,
        color: '#8A8D91',
        marginBottom: 15,
        marginRight: 4
    },
    inputError: {
        borderColor: '#FF3B30',
        backgroundColor: '#FFF0F0'
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
        marginBottom: 40
    },
    primaryButton: {
        backgroundColor: '#0064E0',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        elevation: 2
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600'
    },
    secondaryButton: {
        borderWidth: 1.5,
        borderColor: '#0064E0',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },
    secondaryButtonText: {
        color: '#0064E0',
        fontSize: 15,
        fontWeight: '600'
    }
});
