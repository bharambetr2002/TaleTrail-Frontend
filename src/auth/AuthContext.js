const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      // In a real app, you'd validate the token here
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const result = await ApiService.login(email, password);
      if (result.success && result.data.accessToken) {
        localStorage.setItem("access_token", result.data.accessToken);
        setUser({
          token: result.data.accessToken,
          email: result.data.email,
          userId: result.data.userId,
        });
        return { success: true };
      }
      return { success: false, message: result.message || "Login failed" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const signup = async (email, password, fullName) => {
    try {
      const result = await ApiService.signup(email, password, fullName);
      if (result.success) {
        return { success: true };
      }
      return { success: false, message: result.message || "Signup failed" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
