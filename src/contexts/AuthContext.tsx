import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, User, AuthResponse } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, fullName: string, username: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const isAuthenticated = !!user;

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('taletrail_token');
    const userData = localStorage.getItem('taletrail_user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('taletrail_token');
        localStorage.removeItem('taletrail_user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await apiService.login(email, password);
      
      if (response.success) {
        const { accessToken, user: userData } = response.data;
        localStorage.setItem('taletrail_token', accessToken);
        localStorage.setItem('taletrail_user', JSON.stringify(userData));
        setUser(userData);
        
        toast({
          title: "Welcome back!",
          description: `Good to see you again, ${userData.fullName}`,
        });
        
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: response.message || "Invalid credentials",
        });
        return false;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please check your credentials and try again",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, fullName: string, username: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await apiService.signup(email, password, fullName, username);
      
      if (response.success) {
        const { accessToken, user: userData } = response.data;
        localStorage.setItem('taletrail_token', accessToken);
        localStorage.setItem('taletrail_user', JSON.stringify(userData));
        setUser(userData);
        
        toast({
          title: "Account created!",
          description: `Welcome to TaleTrail, ${userData.fullName}`,
        });
        
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Signup failed",
          description: response.message || "Failed to create account",
        });
        return false;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: "Please try again with different details",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('taletrail_token');
    localStorage.removeItem('taletrail_user');
    setUser(null);
    
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};