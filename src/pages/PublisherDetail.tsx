import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService, Publisher, Book } from '@/services/api';
import { Calendar, BookOpen, ArrowLeft, MapPin, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PublisherDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [publisher, setPublisher] = useState<Publisher | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPublisherData = async () => {
      if (!id) return;
      
      try {
        const publisherResponse = await apiService.getPublisherById(id);
        
        if (publisherResponse.success) {
          setPublisher(publisherResponse.data);
          
          // Get all books and filter by publisher
          const booksResponse = await apiService.getBooks();
          if (booksResponse.success) {
            const publisherBooks = booksResponse.data.filter(book => book.publisherId === id);
            setBooks(publisherBooks);
          }
        }
      } catch (error) {
        console.error('Error fetching publisher data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublisherData();
  }, [id]);

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

  if (!publisher) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-semibold mb-4">Publisher not found</h2>
          <Link to="/publishers">
            <Button className="btn-outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Publishers
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
        <Link to="/publishers" className="inline-flex items-center text-content-medium hover:text-foreground mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Publishers
        </Link>

        {/* Publisher info */}
        <div className="mb-12">
          <div className="flex items-center mb-4">
            <Building2 className="h-8 w-8 mr-3 text-primary" />
            <h1 className="text-4xl font-serif font-semibold">{publisher.name}</h1>
          </div>
          
          <div className="flex flex-wrap gap-6 mb-6">
            {publisher.foundedYear && (
              <div className="flex items-center text-content-medium">
                <Calendar className="h-5 w-5 mr-2" />
                <span className="text-lg">Founded {publisher.foundedYear}</span>
              </div>
            )}
            
            {publisher.address && (
              <div className="flex items-center text-content-medium">
                <MapPin className="h-5 w-5 mr-2" />
                <span className="text-lg">{publisher.address}</span>
              </div>
            )}
          </div>
          
          {publisher.description && (
            <div className="prose prose-lg max-w-none">
              <p className="text-content-dark leading-relaxed">{publisher.description}</p>
            </div>
          )}
        </div>

        {/* Books by this publisher */}
        <div>
          <h2 className="text-3xl font-serif font-semibold mb-8">
            Books from {publisher.name}
            <span className="text-content-medium text-lg ml-2">({books.length})</span>
          </h2>
          
          {books.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-content-medium" />
              <p className="text-content-medium">No books found for this publisher</p>
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
                    
                    <p className="text-content-medium text-sm mb-2">
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
        </div>
      </div>
    </div>
  );
};

export default PublisherDetail;