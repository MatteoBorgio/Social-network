/**
 * File for the context used to store a email
 * used for the verification code procedure
 * between the sendCode and verifyCode screens
 */

import {createContext, useState} from "react";

export const TemporaryEmailContext = createContext(undefined)

export const TemporaryEmailProvider = ({ children }) => {
    const [temporaryEmail, setTemporaryEmail] = useState(null)
    const changeTemporaryEmail = (data) => {
        setTemporaryEmail(data)
    }
    const nullifyTemporaryEmail = () => {
        setTemporaryEmail(null)
    }

    return (
        <TemporaryEmailContext.Provider value={{temporaryEmail, changeTemporaryEmail, nullifyTemporaryEmail}}>
            {children}
        </TemporaryEmailContext.Provider>
    )
}
