import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from local storage on mount
  useEffect(() => {
    // Initialize default admin credentials if not set
    if (!localStorage.getItem('adminCredentials')) {
      localStorage.setItem('adminCredentials', JSON.stringify({ email: 'admin@biteexport.com', password: 'admin123' }));
    }

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
        const credentials = JSON.parse(localStorage.getItem('adminCredentials') || '{"email":"admin@biteexport.com","password":"admin123"}');
        
        if (email === credentials.email && password === credentials.password) {
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

  const updateProfile = async (newEmail, currentPassword, newPassword) => {
    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: newEmail,
          current_password: currentPassword,
          new_password: newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update local credentials to maintain the mock login for now, but also we updated db
      const updatedCredentials = {
        email: data.user.email,
        password: newPassword || currentPassword
      };
      localStorage.setItem('adminCredentials', JSON.stringify(updatedCredentials));

      const updatedUser = { ...user, email: data.user.email };
      setUser(updatedUser);
      localStorage.setItem('adminUser', JSON.stringify(updatedUser));

      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUser');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateProfile, loading }}>
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
