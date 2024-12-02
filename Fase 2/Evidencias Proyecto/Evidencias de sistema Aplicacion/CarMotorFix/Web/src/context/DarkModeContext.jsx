import { useState, useEffect, createContext } from 'react';
import PropTypes from 'prop-types';
import { getDarkModeFromLocalCookie, setDarkMode as saveDarkModePreference } from '../lib/cookies';

const getDefaultDarkMode = () => {
    const savedPreference = getDarkModeFromLocalCookie();
    return savedPreference !== undefined ? savedPreference : false; // Falso como valor por defecto.
};

export const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(getDefaultDarkMode());

    const toggleDarkMode = (enabled) => {
        setDarkMode(enabled);
        saveDarkModePreference(enabled);
    };

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);
    DarkModeProvider.propTypes = {
        children: PropTypes.node.isRequired,
    };

    return (
        <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
};
