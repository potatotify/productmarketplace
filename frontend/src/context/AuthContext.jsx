import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

// Function to decode JWT token
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      // Decode the JWT token to get user information
      if (userData.token) {
        const decodedUser = decodeJWT(userData.token);
        if (decodedUser) {
          setUser({
            ...userData,
            id: decodedUser.id,
            username: decodedUser.username,
            role: decodedUser.role
          });
        }
      }
    }
  }, []);

  function login(userData) {
    // Decode the JWT token to get user information
    if (userData.token) {
      const decodedUser = decodeJWT(userData.token);
      if (decodedUser) {
        const fullUserData = {
          ...userData,
          id: decodedUser.id,
          username: decodedUser.username,
          role: decodedUser.role
        };
        setUser(fullUserData);
        localStorage.setItem('user', JSON.stringify(fullUserData));
      }
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('user');
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
