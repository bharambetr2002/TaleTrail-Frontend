const Layout = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                📚 TaleTrail
              </Link>
              {isAuthenticated && (
                <div className="flex space-x-6">
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
                  >
                    <Home size={18} />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/books"
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
                  >
                    <Book size={18} />
                    <span>Books</span>
                  </Link>
                  <Link
                    to="/blogs"
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
                  >
                    <FileText size={18} />
                    <span>Blogs</span>
                  </Link>
                  <Link
                    to="/authors"
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
                  >
                    <Users size={18} />
                    <span>Authors</span>
                  </Link>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};
