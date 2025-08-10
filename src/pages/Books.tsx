import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService, Book } from '@/services/api';
import { Input } from '@/components/ui/input';
import { BookOpen, Search, Users, Calendar } from 'lucide-react';

const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.getBooks(searchTerm || undefined);
        if (response.success) {
          setBooks(response.data);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(fetchBooks, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-semibold mb-4">Book Collection</h1>
          <p className="text-content-medium mb-8">
            Discover and explore our curated collection of books
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-content-medium" />
            <Input
              type="text"
              placeholder="Search books by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-minimal pl-10"
            />
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="card-minimal animate-pulse">
                <div className="aspect-[3/4] bg-content-light mb-4 rounded"></div>
                <div className="h-4 bg-content-light rounded mb-2"></div>
                <div className="h-3 bg-content-light rounded w-2/3 mb-1"></div>
                <div className="h-3 bg-content-light rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-content-medium" />
            <h3 className="text-xl font-serif font-semibold mb-2">No books found</h3>
            <p className="text-content-medium">
              {searchTerm ? 'Try adjusting your search terms' : 'No books available yet'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-content-medium">
                {searchTerm ? `Found ${books.length} books matching "${searchTerm}"` : `${books.length} books available`}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                    
                    <div className="space-y-2">
                      <h3 className="font-serif font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                        {book.title}
                      </h3>
                      
                      {book.authors.length > 0 && (
                        <div className="flex items-center text-content-medium text-sm">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{book.authors.map(author => author.name).join(', ')}</span>
                        </div>
                      )}
                      
                      {book.publicationYear && (
                        <div className="flex items-center text-content-medium text-sm">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{book.publicationYear}</span>
                        </div>
                      )}
                      
                      {book.publisherName && (
                        <p className="text-content-medium text-xs">
                          {book.publisherName}
                        </p>
                      )}
                      
                      {book.description && (
                        <p className="text-content-medium text-sm line-clamp-2">
                          {book.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Books;