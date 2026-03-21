/**
 * File for the screen that handles the modification
 * of the profile from a verified user
 * Renders the profile of the user and a form
 * to modify the username, bio and profilePic
 */
import React, {useContext, useState} from "react";
import {UserContext} from "../context/UserContext";
import {ActivityIndicator, Alert, View} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

export default function ChangeProfileScreen({ navigation }) {
    const { user, loginUser, isLoading: isContextLoading } = useContext(UserContext);

    const [newProfilePic, setNewProfilePic] = useState(null);
    const [newDesc, setNewDesc] = useState(null);
    const [newUsername, setNewUsername] = useState(null)
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

        if (bio.length > 150) newErrors.bio = "La biografia non può superare i 150 caratteri";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const changeProfile = async () => {
        setIsSubmitted(true);

        if (!validateForm()) return;

        setIsLoading(true);
        const formData = new FormData();

        if (newProfilePic) {
            const uri = newProfilePic.uri;
            const fileName = uri.split('/').pop() || `profile_${Date.now()}.jpg`;
            const fileType = newProfilePic.mimeType || 'image/jpeg';

            formData.append('image', {
                uri: uri,
                name: fileName,
                type: fileType,
            });

            try {
                const response = await axios.patch('http://192.168.1.6:5000/api/auth/change-profile-pic', formData, {
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
                        "Immagine profilo aggiornata con successo!",
                        [{
                            text: "OK",
                        }]
                    );
                }
            } catch (error) {
                let errorMsg = error.response?.data?.message || "Errore durante il salvataggio del profilo";
                Alert.alert("Errore", errorMsg);
            } finally {
                setIsLoading(false);
            }
        }

        if (newDesc) {
            try {
                const data = {
                    desc: newDesc
                }
                const response = await axios.patch('http://192.168.1.6:5000/api/auth/change-bio',  data, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.token}`
                    },
                });

                if (response.data.success) {
                    if (response.data.result) {
                        await loginUser({ ...response.data.result, token: user.token });
                    }

                    Alert.alert(
                        "Successo",
                        "Bio del profilo aggiornata con successo!",
                        [{
                            text: "OK",
                        }]
                    );
                }
            } catch (error) {
                let errorMsg = error.response?.data?.message || "Errore durante il salvataggio del profilo";
                Alert.alert("Errore", errorMsg);
            } finally {
                setIsLoading(false);
            }
        }

        if (newUsername) {
            try {
                const data = {
                    username: newUsername
                }
                const response = await axios.patch('http://192.168.1.6:5000/api/auth/change-username', data, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.token}`
                    },
                });

                if (response.data.success) {
                    if (response.data.result) {
                        await loginUser({ ...response.data.result, token: user.token });
                    }

                    Alert.alert(
                        "Successo",
                        "Username aggiornato con successo!",
                        [{
                            text: "OK",
                        }]
                    );
                }
            } catch (error) {
                let errorMsg = error.response?.data?.message || "Errore durante il salvataggio del profilo";
                Alert.alert("Errore", errorMsg);
            } finally {
                setIsLoading(false);
            }
        }
    }
}
