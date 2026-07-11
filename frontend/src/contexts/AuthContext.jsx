import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from local storage on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('adminAuth');
    const storedUser = localStorage.getItem('adminUser');
    
    if (storedAuth === 'true' && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock Authentication Logic
    // In a real app, this would be an API call to Laravel backend
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@biteexport.com' && password === 'admin123') {
          const userData = { email, name: 'Admin', role: 'admin' };
          
          setIsAuthenticated(true);
          setUser(userData);
          
          localStorage.setItem('adminAuth', 'true');
          localStorage.setItem('adminUser', JSON.stringify(userData));
          
          resolve({ success: true });
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 800); // Simulate network delay
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUser');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
