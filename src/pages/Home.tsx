import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService, Book } from '@/services/api';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight, TrendingUp, Users, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Home: React.FC = () => {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        const response = await apiService.getBooks();
        if (response.success) {
          // Get first 6 books as featured
          setFeaturedBooks(response.data.slice(0, 6));
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedBooks();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <BookOpen className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 leading-tight">
            Track Your Reading<br />
            <span className="text-content-medium">Journey</span>
          </h1>
          <p className="text-xl text-content-medium mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover books, track your progress, write reviews, and share your thoughts 
            with a community of readers. Your personal library awaits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <Link to="/library">
                  <Button className="btn-minimal text-lg px-8 py-4">
                    View My Library
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/books">
                  <Button className="btn-outline text-lg px-8 py-4">
                    Discover Books
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/signup">
                  <Button className="btn-minimal text-lg px-8 py-4">
                    Start Reading
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/books">
                  <Button className="btn-outline text-lg px-8 py-4">
                    Browse Books
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Welcome Message for Authenticated Users */}
      {isAuthenticated && (
        <section className="py-12 px-4 bg-content-light">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-semibold mb-4">
              Welcome back, {user?.fullName}
            </h2>
            <p className="text-content-medium mb-6">
              Ready to continue your reading journey?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link to="/library" className="card-minimal hover:shadow-md text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">My Library</h3>
                <p className="text-content-medium text-sm">Manage your books</p>
              </Link>
              <Link to="/blogs/new" className="card-minimal hover:shadow-md text-center">
                <Star className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Write a Blog</h3>
                <p className="text-content-medium text-sm">Share your thoughts</p>
              </Link>
              <Link to="/books" className="card-minimal hover:shadow-md text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Discover</h3>
                <p className="text-content-medium text-sm">Find new books</p>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Books */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-semibold mb-4">Featured Books</h2>
            <p className="text-content-medium">Discover books loved by our community</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card-minimal animate-pulse">
                  <div className="aspect-[3/4] bg-content-light mb-4 rounded"></div>
                  <div className="h-4 bg-content-light rounded mb-2"></div>
                  <div className="h-3 bg-content-light rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBooks.map((book) => (
                <Link key={book.id} to={`/books/${book.id}`} className="group">
                  <div className="card-minimal hover:shadow-lg transition-all duration-300">
                    <div className="aspect-[3/4] bg-content-light mb-4 rounded flex items-center justify-center">
                      {book.coverImageUrl ? (
                        <img 
                          src={book.coverImageUrl} 
                          alt={book.title}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <BookOpen className="h-12 w-12 text-content-medium" />
                      )}
                    </div>
                    <h3 className="font-serif font-semibold mb-2 group-hover:text-primary transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-content-medium text-sm mb-1">
                      {book.authors.map(author => author.name).join(', ')}
                    </p>
                    {book.publicationYear && (
                      <p className="text-content-medium text-xs">{book.publicationYear}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/books">
              <Button className="btn-outline">
                View All Books
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-content-light">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-semibold mb-4">Why TaleTrail?</h2>
            <p className="text-content-medium">Everything you need for your reading journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-serif font-semibold mb-3">Track Progress</h3>
              <p className="text-content-medium">
                Keep track of what you're reading, what you've completed, 
                and what's on your to-read list.
              </p>
            </div>
            <div className="text-center">
              <Star className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-serif font-semibold mb-3">Write Reviews</h3>
              <p className="text-content-medium">
                Share your thoughts and ratings. Help other readers 
                discover their next great book.
              </p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-serif font-semibold mb-3">Join Community</h3>
              <p className="text-content-medium">
                Connect with fellow readers through blog posts 
                and discover new perspectives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-16 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-serif font-semibold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-content-medium mb-8">
              Join thousands of readers tracking their literary adventures
            </p>
            <Link to="/signup">
              <Button className="btn-minimal text-lg px-8 py-4">
                Create Your Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;