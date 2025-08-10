import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, UserBook } from '@/services/api';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, TrendingUp, CheckCircle, Clock, X, Edit } from 'lucide-react';

const Library: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [books, setBooks] = useState<UserBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<UserBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const response = await apiService.getMyBooks();
        if (response.success) {
          setBooks(response.data);
          setFilteredBooks(response.data);
        }
      } catch (error) {
        console.error('Error fetching library:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLibrary();
  }, []);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredBooks(books);
    } else {
      setFilteredBooks(books.filter(book => book.readingStatus === statusFilter));
    }
  }, [statusFilter, books]);

  const handleUpdateStatus = async (bookId: string, newStatus: string, newProgress?: number) => {
    try {
      const progress = newProgress ?? (newStatus === 'Completed' ? 100 : 0);
      const response = await apiService.updateBookStatus(bookId, newStatus, progress);
      
      if (response.success) {
        toast({
          title: "Status updated",
          description: `Book marked as ${newStatus}`,
        });
        
        // Refresh library
        const libraryResponse = await apiService.getMyBooks();
        if (libraryResponse.success) {
          setBooks(libraryResponse.data);
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update status",
        description: "Please try again",
      });
    }
  };

  const handleRemoveFromLibrary = async (bookId: string) => {
    try {
      const response = await apiService.removeBookFromLibrary(bookId);
      
      if (response.success) {
        toast({
          title: "Book removed",
          description: "Book removed from your library",
        });
        
        setBooks(books.filter(book => book.bookId !== bookId));
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to remove book",
        description: "Please try again",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ToRead':
        return <Clock className="h-4 w-4" />;
      case 'InProgress':
        return <TrendingUp className="h-4 w-4" />;
      case 'Completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'Dropped':
        return <X className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ToRead':
        return 'text-content-medium';
      case 'InProgress':
        return 'text-primary';
      case 'Completed':
        return 'text-green-600';
      case 'Dropped':
        return 'text-red-600';
      default:
        return 'text-content-medium';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStats = () => {
    const toRead = books.filter(b => b.readingStatus === 'ToRead').length;
    const inProgress = books.filter(b => b.readingStatus === 'InProgress').length;
    const completed = books.filter(b => b.readingStatus === 'Completed').length;
    const dropped = books.filter(b => b.readingStatus === 'Dropped').length;
    
    return { toRead, inProgress, completed, dropped, total: books.length };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-serif font-semibold mb-4">
            {user?.fullName}'s Library
          </h1>
          <p className="text-content-medium mb-8">
            Manage your reading collection and track your progress
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="card-minimal text-center">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-content-medium text-sm">Total Books</div>
            </div>
            <div className="card-minimal text-center">
              <div className="text-2xl font-bold text-content-medium">{stats.toRead}</div>
              <div className="text-content-medium text-sm">To Read</div>
            </div>
            <div className="card-minimal text-center">
              <div className="text-2xl font-bold text-primary">{stats.inProgress}</div>
              <div className="text-content-medium text-sm">Reading</div>
            </div>
            <div className="card-minimal text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-content-medium text-sm">Completed</div>
            </div>
            <div className="card-minimal text-center">
              <div className="text-2xl font-bold text-red-600">{stats.dropped}</div>
              <div className="text-content-medium text-sm">Dropped</div>
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium">Filter by status:</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Books</SelectItem>
                <SelectItem value="ToRead">To Read</SelectItem>
                <SelectItem value="InProgress">Currently Reading</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Dropped">Dropped</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Books */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-minimal animate-pulse">
                <div className="aspect-[3/4] bg-content-light rounded mb-4"></div>
                <div className="h-4 bg-content-light rounded mb-2"></div>
                <div className="h-3 bg-content-light rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-content-medium" />
            <h3 className="text-xl font-serif font-semibold mb-2">
              {statusFilter === 'all' ? 'Your library is empty' : `No ${statusFilter.toLowerCase()} books`}
            </h3>
            <p className="text-content-medium mb-6">
              {statusFilter === 'all' 
                ? 'Start building your reading collection!' 
                : 'Try a different filter or add more books.'
              }
            </p>
            <Link to="/books">
              <Button className="btn-minimal">Discover Books</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((userBook) => (
              <div key={userBook.id} className="card-minimal hover:shadow-lg transition-all duration-300">
                <Link to={`/books/${userBook.bookId}`} className="block mb-4">
                  <div className="aspect-[3/4] bg-content-light rounded flex items-center justify-center overflow-hidden mb-3">
                    {userBook.bookCoverUrl ? (
                      <img 
                        src={userBook.bookCoverUrl} 
                        alt={userBook.bookTitle}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <BookOpen className="h-12 w-12 text-content-medium" />
                    )}
                  </div>
                  <h3 className="font-serif font-semibold text-lg hover:text-primary transition-colors">
                    {userBook.bookTitle}
                  </h3>
                </Link>

                {/* Status */}
                <div className={`flex items-center mb-3 ${getStatusColor(userBook.readingStatus)}`}>
                  {getStatusIcon(userBook.readingStatus)}
                  <span className="ml-2 text-sm font-medium">{userBook.readingStatus}</span>
                </div>

                {/* Progress */}
                {userBook.readingStatus === 'InProgress' && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{userBook.progress}%</span>
                    </div>
                    <Progress value={userBook.progress} className="h-2" />
                  </div>
                )}

                {/* Dates */}
                <div className="text-content-medium text-xs mb-4 space-y-1">
                  <div>Added: {formatDate(userBook.addedAt)}</div>
                  {userBook.startedAt && (
                    <div>Started: {formatDate(userBook.startedAt)}</div>
                  )}
                  {userBook.completedAt && (
                    <div>Completed: {formatDate(userBook.completedAt)}</div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Select 
                    value={userBook.readingStatus} 
                    onValueChange={(value) => handleUpdateStatus(userBook.bookId, value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ToRead">To Read</SelectItem>
                      <SelectItem value="InProgress">Reading</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Dropped">Dropped</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveFromLibrary(userBook.bookId)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;