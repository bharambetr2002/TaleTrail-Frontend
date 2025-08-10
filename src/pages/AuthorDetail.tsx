import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService, Author, Book } from '@/services/api';
import { Calendar, BookOpen, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AuthorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [author, setAuthor] = useState<Author | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuthorData = async () => {
      if (!id) return;
      
      try {
        const [authorResponse, booksResponse] = await Promise.all([
          apiService.getAuthorById(id),
          apiService.getBooksByAuthor(id)
        ]);
        
        if (authorResponse.success) {
          setAuthor(authorResponse.data);
        }
        
        if (booksResponse.success) {
          setBooks(booksResponse.data);
        }
      } catch (error) {
        console.error('Error fetching author data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthorData();
  }, [id]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-content-light rounded w-1/3 mb-8"></div>
            <div className="h-12 bg-content-light rounded w-2/3 mb-4"></div>
            <div className="h-4 bg-content-light rounded w-1/2 mb-6"></div>
            <div className="h-32 bg-content-light rounded mb-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-semibold mb-4">Author not found</h2>
          <Link to="/authors">
            <Button className="btn-outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Authors
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link to="/authors" className="inline-flex items-center text-content-medium hover:text-foreground mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Authors
        </Link>

        {/* Author info */}
        <div className="mb-12">
          <h1 className="text-4xl font-serif font-semibold mb-4">{author.name}</h1>
          
          {(author.birthDate || author.deathDate) && (
            <div className="flex items-center text-content-medium mb-6">
              <Calendar className="h-5 w-5 mr-2" />
              <span className="text-lg">
                {formatDate(author.birthDate)}
                {author.deathDate && ` - ${formatDate(author.deathDate)}`}
                {!author.deathDate && author.birthDate && ' - Present'}
              </span>
            </div>
          )}
          
          {author.bio && (
            <div className="prose prose-lg max-w-none">
              <p className="text-content-dark leading-relaxed">{author.bio}</p>
            </div>
          )}
        </div>

        {/* Books by this author */}
        <div>
          <h2 className="text-3xl font-serif font-semibold mb-8">
            Books by {author.name}
            <span className="text-content-medium text-lg ml-2">({books.length})</span>
          </h2>
          
          {books.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-content-medium" />
              <p className="text-content-medium">No books found for this author</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <Link key={book.id} to={`/books/${book.id}`} className="group">
                  <div className="card-minimal hover:shadow-lg transition-all duration-300">
                    <div className="aspect-[3/4] bg-content-light mb-4 rounded flex items-center justify-center overflow-hidden">
                      {book.coverImageUrl ? (
                        <img 
                          src={book.coverImageUrl} 
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BookOpen className="h-12 w-12 text-content-medium" />
                      )}
                    </div>
                    
                    <h3 className="font-serif font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {book.title}
                    </h3>
                    
                    {book.publicationYear && (
                      <p className="text-content-medium text-sm mb-2">{book.publicationYear}</p>
                    )}
                    
                    {book.publisherName && (
                      <p className="text-content-medium text-xs">{book.publisherName}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorDetail;