import React, { createContext, useState, useEffect } from 'react';
import { getDarkModeFromLocalCookie, setDarkMode as saveDarkModePreference } from '../lib/cookies';

export const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(getDarkModeFromLocalCookie());

    const toggleDarkMode = (enabled) => {
        setDarkMode(enabled);
        saveDarkModePreference(enabled);
    };

    useEffect(() => {
        // Aplica o remueve la clase 'dark' al elemento <html>
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
};