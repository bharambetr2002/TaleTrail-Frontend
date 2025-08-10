import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { BookOpen, User, LogOut, Search, Home, Users, Building2, Edit3 } from 'lucide-react';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8" />
            <h1 className="text-2xl font-serif font-semibold">TaleTrail</h1>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="flex items-center space-x-1 text-foreground hover:text-content-medium transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link 
              to="/books" 
              className="flex items-center space-x-1 text-foreground hover:text-content-medium transition-colors"
            >
              <Search className="h-4 w-4" />
              <span>Books</span>
            </Link>
            <Link 
              to="/authors" 
              className="flex items-center space-x-1 text-foreground hover:text-content-medium transition-colors"
            >
              <Users className="h-4 w-4" />
              <span>Authors</span>
            </Link>
            <Link 
              to="/publishers" 
              className="flex items-center space-x-1 text-foreground hover:text-content-medium transition-colors"
            >
              <Building2 className="h-4 w-4" />
              <span>Publishers</span>
            </Link>
            <Link 
              to="/blogs" 
              className="flex items-center space-x-1 text-foreground hover:text-content-medium transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              <span>Blogs</span>
            </Link>
          </nav>

          {/* User actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/library">
                  <Button variant="ghost" size="sm">
                    My Library
                  </Button>
                </Link>
                <div className="flex items-center space-x-2">
                  <Link to="/profile" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user?.username}</span>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="text-content-medium hover:text-foreground"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="btn-minimal">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;