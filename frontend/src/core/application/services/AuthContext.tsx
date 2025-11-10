import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  guestLogin: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    verifyAuth();
  }, []);

  const verifyAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await fetch('http://localhost:3000/api/auth/verify', {
          headers: { 'Authorization': `Bearer ${token}` },
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser({
            email: data.user.email,
            role: data.user.role
          });
        } else {
          localStorage.removeItem('accessToken');
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth verification failed:', error);
      localStorage.removeItem('accessToken');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    console.log('Login response:', data);
    
    // CRITICAL: Store token FIRST
    localStorage.setItem('accessToken', data.accessToken);
    console.log('Token stored:', localStorage.getItem('accessToken'));
    
    // THEN set user state
    setUser({
      email: data.user.email,
      role: data.user.role || 'user'
    });
    
    console.log('Login complete, user set');
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

const guestLogin = async () => {
  try {
    console.log('Starting guest login...');
    
    const response = await fetch('http://localhost:3000/api/auth/guest', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Guest login failed');
    }

    const data = await response.json();
    console.log('Guest login response:', data);
    
    // CRITICAL: Store token FIRST
    localStorage.setItem('accessToken', data.accessToken);
    console.log('Token stored:', localStorage.getItem('accessToken'));
    
    // THEN set user state
    setUser({
      email: data.user.email,
      role: data.user.role
    });
    
    console.log('Guest login complete');
  } catch (error) {
    console.error('Guest login error:', error);
    throw error;
  }
};


  const register = async (email: string, password: string, name: string) => {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      guestLogin, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
