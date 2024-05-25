import React, { createContext } from 'react';

export const AuthContext = createContext(null)

const AuthProvider = ({children}) => {

    const authFunctions = {}

    return (
        <AuthContext.Provider value={authFunctions}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;