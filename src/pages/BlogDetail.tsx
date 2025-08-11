import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService, BlogPost } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Heart, User, Calendar, ArrowLeft, Edit2, Trash2 } from 'lucide-react';

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await apiService.getBlogById(id!);
      if (response.success) {
        setBlog(response.data);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load blog post",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!blog || !isAuthenticated) return;

    try {
      if (blog.isLikedByCurrentUser) {
        await apiService.unlikeBlog(blog.id);
      } else {
        await apiService.likeBlog(blog.id);
      }
      
      // Refresh blog to get updated like count
      await fetchBlog();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update like status",
      });
    }
  };

  const handleDelete = async () => {
    if (!blog) return;

    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        const response = await apiService.deleteBlog(blog.id);
        if (response.success) {
          toast({
            title: "Blog deleted",
            description: "Your blog post has been deleted successfully",
          });
          navigate('/blogs');
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete blog post",
        });
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
        <Button asChild>
          <Link to="/blogs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Link>
        </Button>
      </div>
    );
  }

  const isOwner = user?.id === blog.userId;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/blogs')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Blogs
      </Button>

      <Card>
        <CardContent className="p-8">
          <article>
            <header className="mb-8">
              <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
              
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <Link 
                      to={`/profile/${blog.username}`}
                      className="hover:text-primary transition-colors"
                    >
                      {blog.username}
                    </Link>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <time>{formatDate(blog.createdAt)}</time>
                  </div>
                </div>

                {isOwner && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={handleDelete}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </header>

            <div className="prose prose-lg max-w-none mb-8">
              <div className="text-foreground leading-relaxed whitespace-pre-wrap">
                {blog.content}
              </div>
            </div>

            <footer className="border-t pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {isAuthenticated && (
                    <Button
                      variant={blog.isLikedByCurrentUser ? "default" : "outline"}
                      size="sm"
                      onClick={handleLike}
                      className="flex items-center gap-2"
                    >
                      <Heart className={`h-4 w-4 ${blog.isLikedByCurrentUser ? 'fill-current' : ''}`} />
                      {blog.likeCount} {blog.likeCount === 1 ? 'Like' : 'Likes'}
                    </Button>
                  )}
                  
                  {!isAuthenticated && blog.likeCount > 0 && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Heart className="h-4 w-4" />
                      <span>{blog.likeCount} {blog.likeCount === 1 ? 'Like' : 'Likes'}</span>
                    </div>
                  )}
                </div>

                {blog.updatedAt !== blog.createdAt && (
                  <p className="text-sm text-muted-foreground">
                    Last updated: {formatDate(blog.updatedAt)}
                  </p>
                )}
              </div>
            </footer>
          </article>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogDetail;