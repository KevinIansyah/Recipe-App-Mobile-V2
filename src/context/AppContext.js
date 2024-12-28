import { createContext, useEffect, useState } from 'react';
import { getToken } from '../helpers/token';
import axios from 'axios';

export const AppContext = createContext();

const API = {
  baseURL: 'https://recipe.keviniansyah.com/api',
  headers: (token) => ({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  }),
};

export default function AppProvider({ children }) {
  const [state, setState] = useState({
    token: null,
    user: {},
    loading: true,
  });

  const fetchUser = async (token) => {
    try {
      const response = await axios.get(`${API.baseURL}/user`, {
        headers: API.headers(token),
      });
      setState((prev) => ({ ...prev, user: response.data }));
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const setToken = async (newToken) => {
    setState((prev) => ({ ...prev, token: newToken }));
  };

  const setUser = (userData) => {
    setState((prev) => ({ ...prev, user: userData }));
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = await getToken();
      if (savedToken) {
        setState((prev) => ({ ...prev, token: savedToken }));
        await fetchUser(savedToken);
      }
      setState((prev) => ({ ...prev, loading: false }));
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (state.token) {
      fetchUser(state.token);
    }
  }, [state.token]);

  const contextValue = {
    token: state.token,
    user: state.user,
    setToken,
    setUser,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
