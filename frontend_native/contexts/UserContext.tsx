import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    role: string;
    avatar: string | null;
    institution: string;
    is_deleted: boolean;
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    updateUser: (updates: Partial<User>) => void;
    clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const updateUser = (updates: Partial<User>) => {
        setUser((prev) => (prev ? { ...prev, ...updates } : null));
    };

    const clearUser = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, setUser, updateUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
