import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface Card {
    id: string;
    displayName: string;
    roleName: string;
    BGColor: string; // Optional, if card has a background color
    TextColor: string; // Optional, if card has a text color
}

interface User {
    id: string;
    email: string;
    userName: string;
    roleName: string;
    cards?: Card[]; // Optional, if user has cards
    mainCard?: Card; // Optional, if user has a main card
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isAuthenticated: boolean;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
    const [user, setUser] = useState<User | null>(null);

    const logout = () => {
        setUser(null);
        localStorage.removeItem("authToken");
    };

    const value = {
        user,
        setUser,
        isAuthenticated: !!user,
        logout,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
