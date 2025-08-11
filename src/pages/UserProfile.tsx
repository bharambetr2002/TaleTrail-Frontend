import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService, User, BlogPost } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, User as UserIcon, Calendar, Edit3, Heart, ArrowLeft } from 'lucide-react';

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [userBlogs, setUserBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (username) {
      fetchUserProfile();
    }
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      const [profileResponse, blogsResponse] = await Promise.all([
        apiService.getPublicProfile(username!),
        apiService.getBlogs() // We'll filter by user after getting all blogs
      ]);

      if (profileResponse.success) {
        setUser(profileResponse.data);
      }

      if (blogsResponse.success) {
        // Filter blogs by username since the API might not support user filtering
        const filteredBlogs = blogsResponse.data.filter(blog => blog.username === username);
        setUserBlogs(filteredBlogs);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">User not found</h1>
        <Button asChild>
          <Link to="/blogs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button 
        variant="ghost" 
        onClick={() => window.history.back()}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {/* User Profile Card */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                {user.avatarUrl ? (
                  <img 
                    src={user.avatarUrl} 
                    alt={`${user.username}'s avatar`}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{user.fullName}</h1>
              <p className="text-xl text-muted-foreground mb-4">@{user.username}</p>
              
              {user.bio && (
                <p className="text-foreground mb-4">{user.bio}</p>
              )}
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Edit3 className="h-4 w-4" />
                  <span>{userBlogs.length} {userBlogs.length === 1 ? 'post' : 'posts'}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User's Blog Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Blog Posts by {user.username}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userBlogs.length === 0 ? (
            <div className="text-center py-8">
              <Edit3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No blog posts yet</h3>
              <p className="text-muted-foreground">
                {user.username} hasn't written any blog posts yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {userBlogs.map((blog) => (
                <article key={blog.id} className="border-b border-border pb-6 last:border-b-0">
                  <Link to={`/blogs/${blog.id}`}>
                    <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
                      {blog.title}
                    </h3>
                  </Link>
                  
                  <p className="text-muted-foreground mb-3 line-clamp-3">
                    {blog.content}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{blog.likeCount} {blog.likeCount === 1 ? 'like' : 'likes'}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;