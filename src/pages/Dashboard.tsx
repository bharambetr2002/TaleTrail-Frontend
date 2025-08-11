import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, UserBook, BlogPost } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, BookOpen, PenTool, Star, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [myBooks, setMyBooks] = useState<UserBook[]>([]);
  const [myBlogs, setMyBlogs] = useState<BlogPost[]>([]);
  const [stats, setStats] = useState({
    totalBooks: 0,
    completedBooks: 0,
    inProgressBooks: 0,
    totalBlogs: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [booksResponse, blogsResponse] = await Promise.all([
        apiService.getMyBooks(),
        apiService.getBlogs(user?.id)
      ]);

      if (booksResponse.success) {
        setMyBooks(booksResponse.data);
        setStats(prev => ({
          ...prev,
          totalBooks: booksResponse.data.length,
          completedBooks: booksResponse.data.filter(book => book.readingStatus === 'Completed').length,
          inProgressBooks: booksResponse.data.filter(book => book.readingStatus === 'InProgress').length,
        }));
      }

      if (blogsResponse.success) {
        setMyBlogs(blogsResponse.data);
        setStats(prev => ({
          ...prev,
          totalBlogs: blogsResponse.data.length,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const recentBooks = myBooks.slice(0, 3);
  const recentBlogs = myBlogs.slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.fullName || user?.username}!
        </h1>
        <p className="text-muted-foreground">
          Here's your reading progress and recent activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Books</p>
                <p className="text-2xl font-bold">{stats.totalBooks}</p>
              </div>
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedBooks}</p>
              </div>
              <Star className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgressBooks}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Blog Posts</p>
                <p className="text-2xl font-bold">{stats.totalBlogs}</p>
              </div>
              <PenTool className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Books */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Books</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link to="/library">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentBooks.length > 0 ? (
              <div className="space-y-4">
                {recentBooks.map((book) => (
                  <div key={book.id} className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="w-12 h-16 bg-muted rounded flex-shrink-0">
                      {book.bookCoverUrl ? (
                        <img 
                          src={book.bookCoverUrl} 
                          alt={book.bookTitle}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted rounded" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{book.bookTitle}</h4>
                      <p className="text-sm text-muted-foreground">
                        {book.readingStatus} • {book.progress}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No books in your library yet.{" "}
                <Link to="/books" className="text-primary hover:underline">
                  Browse books
                </Link>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Blogs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>My Recent Blogs</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link to="/create-blog">Write New</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentBlogs.length > 0 ? (
              <div className="space-y-4">
                {recentBlogs.map((blog) => (
                  <div key={blog.id} className="p-3 rounded-lg border">
                    <h4 className="font-medium mb-1 line-clamp-1">{blog.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {blog.content}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{blog.likeCount} likes</span>
                      <span>•</span>
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                You haven't written any blogs yet.{" "}
                <Link to="/create-blog" className="text-primary hover:underline">
                  Write your first post
                </Link>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;