// src/utils/auth.js
export const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
};

export const getAuthHeader = () => {
    const token = getToken();
    console.log("Getting auth header, token exists:", !!token);
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const setToken = (token, remember = false) => {
    if (remember) {
        localStorage.setItem("token", token);
        sessionStorage.removeItem("token");
    } else {
        sessionStorage.setItem("token", token);
        localStorage.removeItem("token");
    }
};

export const clearToken = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
};

export const getUser = () => {
    const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch (e) {
            return null;
        }
    }
    return null;
};

export const setUser = (user, remember = false) => {
    const userStr = JSON.stringify(user);
    if (remember) {
        localStorage.setItem("user", userStr);
        sessionStorage.removeItem("user");
    } else {
        sessionStorage.setItem("user", userStr);
        localStorage.removeItem("user");
    }
};

export const clearAuth = () => {
    clearToken();
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
};

export const isAuthenticated = () => {
    return !!getToken();
};