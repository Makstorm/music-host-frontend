import { createContext, useState, ReactNode } from 'react';

interface Props {
    auth: Record<string, unknown>;
    setAuth: (auth: Record<string, unknown>) => void;
}

const AuthContext = createContext<Props>({
    auth: {},
    setAuth: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [auth, setAuth] = useState<Record<string, unknown>>({});

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;