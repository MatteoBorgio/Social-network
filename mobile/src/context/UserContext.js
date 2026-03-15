/**
 * File for the context which contains all
 * the user data locally stored in the application
 * Provides all the function for modify the user data
 * inside the application
 */

import { createContext, useState, useEffect } from "react";
// using a storage locally stored in the device
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const savedUser = await AsyncStorage.getItem('userData');
                if (savedUser) {
                    setUser(JSON.parse(savedUser));
                }
            } catch (error) {
                console.log("Errore recupero sessione:", error);
            } finally {
                setIsLoading(false)
            }
        };
        checkUser();
    }, []);

    const loginUser = async (userData) => {
        setUser(userData)
        await AsyncStorage.setItem('userData', JSON.stringify(userData))
    };

    const logoutUser = async () => {
        setUser(null)
        await AsyncStorage.removeItem('userData')
    };

    return (
        <UserContext.Provider value={{ user, loginUser, logoutUser, isLoading }}>
            {children}
        </UserContext.Provider>
    );
}