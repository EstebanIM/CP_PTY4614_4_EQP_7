import Cookies from 'js-cookie';
import { fetcher } from './strApi';

export const setToken = (data) => {
    if (typeof window === 'undefined') {
        return;
    }
    Cookies.set('id', data.user.id);
    Cookies.set('username', data.user.username);
    Cookies.set('documentId', data.user.documentId);
    Cookies.set('jwt', data.jwt);

};

export const unsetToken = () => {
    if (typeof window === 'undefined') {
        return;
    }
    Cookies.remove('id');
    Cookies.remove('jwt');
    Cookies.remove('documentId');
    Cookies.remove('username');

    // Router.reload('/');
};

export const getUserFromLocalCookie = () => {
    const jwt = getTokenFromLocalCookie();
    if (jwt) {
        return fetcher(`${import.meta.env.VITE_STRAPI_URL}/api/users/me`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwt}`,
            },
        })
            .then((data) => {
                return data.username;
            })
            .catch((error) => console.error(error));
    } else {
        return;
    }
};

export const getIdFromLocalCookie = () => {
    const jwt = getTokenFromLocalCookie();
    if (jwt) {
        return fetcher(`${import.meta.env.VITE_STRAPI_URL}/api/users/me`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwt}`,
            },
        }).then((data) => {
            return data.id;
        });
    } else {
        return;
    }
};

export const getdocumentIdFromLocalCookie = () => {
    const jwt = getTokenFromLocalCookie();
    if (jwt) {
        return fetcher(`${import.meta.env.VITE_STRAPI_URL}/api/users/me`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwt}`,
            },
        }).then((data) => {
            return data.documentId;
        });
    } else {
        return;
    }
};

export const getTokenFromLocalCookie = () => {
    return Cookies.get('jwt');
};

export const getTokenFromServerCookie = (req) => {
    if (!req.headers.cookie || '') {
        return undefined;
    }
    const jwtCookie = req.headers.cookie
        .split(';')
        .find((c) => c.trim().startsWith('jwt='));
    if (!jwtCookie) {
        return undefined;
    }
    const jwt = jwtCookie.split('=')[1];
    return jwt;
};

export const getIdFromServerCookie = (req) => {
    if (!req.headers.cookie || '') {
        return undefined;
    }
    const idCookie = req.headers.cookie
        .split(';')
        .find((c) => c.trim().startsWith('id='));
    if (!idCookie) {
        return undefined;
    }
    const id = idCookie.split('=')[1];
    return id;
};
