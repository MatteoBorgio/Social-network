import {createContext, useState} from "react";

export const UserContext = createContext(undefined)

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    const loginUser = (userData) => {
        setUser(userData);
    };

    const logoutUser = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
}