import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService, Author } from '@/services/api';
import { Users, Calendar, BookOpen } from 'lucide-react';

const Authors: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await apiService.getAuthors();
        if (response.success) {
          setAuthors(response.data);
        }
      } catch (error) {
        console.error('Error fetching authors:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).getFullYear();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-semibold mb-4">Authors</h1>
          <p className="text-content-medium">
            Discover the brilliant minds behind your favorite books
          </p>
        </div>

        {/* Authors Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="card-minimal animate-pulse">
                <div className="h-6 bg-content-light rounded mb-3"></div>
                <div className="h-4 bg-content-light rounded mb-2"></div>
                <div className="h-4 bg-content-light rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-content-light rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : authors.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 mx-auto mb-4 text-content-medium" />
            <h3 className="text-xl font-serif font-semibold mb-2">No authors found</h3>
            <p className="text-content-medium">Check back later for more authors</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authors.map((author) => (
              <Link key={author.id} to={`/authors/${author.id}`} className="group">
                <div className="card-minimal hover:shadow-lg transition-all duration-300">
                  <h3 className="text-xl font-serif font-semibold mb-3 group-hover:text-primary transition-colors">
                    {author.name}
                  </h3>
                  
                  {(author.birthDate || author.deathDate) && (
                    <div className="flex items-center text-content-medium text-sm mb-3">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {formatDate(author.birthDate)}
                        {author.deathDate && ` - ${formatDate(author.deathDate)}`}
                        {!author.deathDate && author.birthDate && ' - Present'}
                      </span>
                    </div>
                  )}
                  
                  {author.bookCount !== undefined && (
                    <div className="flex items-center text-content-medium text-sm mb-3">
                      <BookOpen className="h-4 w-4 mr-2" />
                      <span>{author.bookCount} {author.bookCount === 1 ? 'book' : 'books'}</span>
                    </div>
                  )}
                  
                  {author.bio && (
                    <p className="text-content-medium text-sm line-clamp-3">
                      {author.bio}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Authors;