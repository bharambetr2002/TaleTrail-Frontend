import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService, BlogPost } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Edit3, Heart, User, Calendar, Plus } from 'lucide-react';

const Blogs: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await apiService.getBlogs();
        if (response.success) {
          setBlogs(response.data);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleLike = async (blogId: string, isLiked: boolean) => {
    try {
      if (isLiked) {
        await apiService.unlikeBlog(blogId);
      } else {
        await apiService.likeBlog(blogId);
      }
      
      // Refresh blogs to get updated like counts
      const response = await apiService.getBlogs();
      if (response.success) {
        setBlogs(response.data);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-serif font-semibold mb-4">Reading Blogs</h1>
            <p className="text-content-medium">
              Discover thoughts and insights from fellow readers
            </p>
          </div>
          {isAuthenticated && (
            <Link to="/create-blog">
              <Button className="btn-minimal">
                <Plus className="mr-2 h-4 w-4" />
                Write Blog
              </Button>
            </Link>
          )}
        </div>

        {/* Blogs list */}
        {isLoading ? (
          <div className="space-y-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card-minimal animate-pulse">
                <div className="h-6 bg-content-light rounded w-2/3 mb-3"></div>
                <div className="h-4 bg-content-light rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-content-light rounded mb-2"></div>
                <div className="h-4 bg-content-light rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12">
            <Edit3 className="h-16 w-16 mx-auto mb-4 text-content-medium" />
            <h3 className="text-xl font-serif font-semibold mb-2">No blogs yet</h3>
            <p className="text-content-medium mb-6">
              Be the first to share your reading thoughts!
            </p>
            {isAuthenticated && (
              <Link to="/create-blog">
                <Button className="btn-minimal">
                  <Plus className="mr-2 h-4 w-4" />
                  Write First Blog
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {blogs.map((blog) => (
              <article key={blog.id} className="card-minimal hover:shadow-lg transition-all duration-300">
                <Link to={`/blogs/${blog.id}`} className="block">
                  <h2 className="text-2xl font-serif font-semibold mb-3 hover:text-primary transition-colors">
                    {blog.title}
                  </h2>
                </Link>
                
                <div className="flex items-center text-content-medium text-sm mb-4 space-x-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <Link to={`/profile/${blog.username}`} className="hover:text-primary">
                      {blog.username}
                    </Link>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <time>{formatDate(blog.createdAt)}</time>
                  </div>
                </div>
                
                <div className="prose prose-lg max-w-none mb-4">
                  <p className="text-content-dark leading-relaxed line-clamp-3">
                    {blog.content}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <Link 
                    to={`/blogs/${blog.id}`}
                    className="text-primary hover:text-content-dark text-sm font-medium"
                  >
                    Read more →
                  </Link>
                  
                  <div className="flex items-center space-x-2">
                    {isAuthenticated && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleLike(blog.id, blog.isLikedByCurrentUser);
                        }}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
                          blog.isLikedByCurrentUser 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-content-light text-content-medium hover:bg-hover'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${blog.isLikedByCurrentUser ? 'fill-current' : ''}`} />
                        <span>{blog.likeCount}</span>
                      </button>
                    )}
                    {!isAuthenticated && blog.likeCount > 0 && (
                      <div className="flex items-center space-x-1 text-content-medium text-sm">
                        <Heart className="h-4 w-4" />
                        <span>{blog.likeCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;