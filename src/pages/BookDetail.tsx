import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService, Book, Review, UserBook } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, ArrowLeft, Users, Calendar, Star, Plus, Edit, Trash2, Heart } from 'lucide-react';

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userBook, setUserBook] = useState<UserBook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToLibrary, setIsAddingToLibrary] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewContent, setReviewContent] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchBookData = async () => {
      if (!id) return;
      
      try {
        const [bookResponse, reviewsResponse] = await Promise.all([
          apiService.getBookById(id),
          apiService.getBookReviews(id)
        ]);
        
        if (bookResponse.success) {
          setBook(bookResponse.data);
        }
        
        if (reviewsResponse.success) {
          setReviews(reviewsResponse.data);
        }

        // Check if book is in user's library (if authenticated)
        if (isAuthenticated) {
          try {
            const libraryResponse = await apiService.getMyBooks();
            if (libraryResponse.success) {
              const bookInLibrary = libraryResponse.data.find(ub => ub.bookId === id);
              setUserBook(bookInLibrary || null);
            }
          } catch (error) {
            console.error('Error checking library status:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching book data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookData();
  }, [id, isAuthenticated]);

  const handleAddToLibrary = async (status: string) => {
    if (!id) return;
    
    setIsAddingToLibrary(true);
    try {
      const response = await apiService.addBookToLibrary(id, status);
      if (response.success) {
        toast({
          title: "Book added to library",
          description: `Added with status: ${status}`,
        });
        
        // Refresh library status
        const libraryResponse = await apiService.getMyBooks();
        if (libraryResponse.success) {
          const bookInLibrary = libraryResponse.data.find(ub => ub.bookId === id);
          setUserBook(bookInLibrary || null);
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to add book",
        description: "Please try again",
      });
    } finally {
      setIsAddingToLibrary(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!id) return;
    
    setIsSubmittingReview(true);
    try {
      const response = await apiService.createReview(id, reviewRating, reviewContent);
      if (response.success) {
        toast({
          title: "Review submitted",
          description: "Thank you for your review!",
        });
        setShowReviewForm(false);
        setReviewContent('');
        setReviewRating(5);
        
        // Refresh reviews
        const reviewsResponse = await apiService.getBookReviews(id);
        if (reviewsResponse.success) {
          setReviews(reviewsResponse.data);
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to submit review",
        description: "Please try again",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? 'fill-current text-primary' : 'text-content-light'}`} />
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-content-light rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="aspect-[3/4] bg-content-light rounded"></div>
              <div className="md:col-span-2">
                <div className="h-8 bg-content-light rounded mb-4"></div>
                <div className="h-4 bg-content-light rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-content-light rounded w-1/2 mb-4"></div>
                <div className="h-32 bg-content-light rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-semibold mb-4">Book not found</h2>
          <Link to="/books">
            <Button className="btn-outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Books
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link to="/books" className="inline-flex items-center text-content-medium hover:text-foreground mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Books
        </Link>

        {/* Book details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Cover */}
          <div className="aspect-[3/4] bg-content-light rounded flex items-center justify-center overflow-hidden">
            {book.coverImageUrl ? (
              <img 
                src={book.coverImageUrl} 
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <BookOpen className="h-24 w-24 text-content-medium" />
            )}
          </div>

          {/* Info */}
          <div className="md:col-span-2">
            <h1 className="text-4xl font-serif font-semibold mb-4">{book.title}</h1>
            
            {book.authors.length > 0 && (
              <div className="flex items-center text-content-medium mb-2">
                <Users className="h-5 w-5 mr-2" />
                <span className="text-lg">
                  {book.authors.map((author, index) => (
                    <Link 
                      key={author.id} 
                      to={`/authors/${author.id}`}
                      className="hover:text-primary"
                    >
                      {author.name}{index < book.authors.length - 1 ? ', ' : ''}
                    </Link>
                  ))}
                </span>
              </div>
            )}
            
            {book.publicationYear && (
              <div className="flex items-center text-content-medium mb-2">
                <Calendar className="h-5 w-5 mr-2" />
                <span className="text-lg">{book.publicationYear}</span>
              </div>
            )}
            
            {book.publisherName && (
              <p className="text-content-medium mb-4">Published by {book.publisherName}</p>
            )}

            {/* Rating */}
            {reviews.length > 0 && (
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-2">
                  {renderStars(Math.round(averageRating))}
                </div>
                <span className="text-content-medium">
                  {averageRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}

            {/* Library actions */}
            {isAuthenticated && (
              <div className="mb-6">
                {userBook ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-primary font-medium">
                      <Heart className="inline h-4 w-4 mr-1" />
                      In your library: {userBook.readingStatus}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      onClick={() => handleAddToLibrary('ToRead')}
                      disabled={isAddingToLibrary}
                      className="btn-outline"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Want to Read
                    </Button>
                    <Button 
                      onClick={() => handleAddToLibrary('InProgress')}
                      disabled={isAddingToLibrary}
                      className="btn-minimal"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Currently Reading
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {book.description && (
              <div className="prose prose-lg max-w-none">
                <p className="text-content-dark leading-relaxed">{book.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews section */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-serif font-semibold">
              Reviews ({reviews.length})
            </h2>
            {isAuthenticated && !showReviewForm && (
              <Button onClick={() => setShowReviewForm(true)} className="btn-outline">
                <Edit className="mr-2 h-4 w-4" />
                Write Review
              </Button>
            )}
          </div>

          {/* Review form */}
          {showReviewForm && (
            <div className="card-minimal mb-8">
              <h3 className="text-xl font-serif font-semibold mb-4">Write a Review</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Rating</label>
                <Select value={reviewRating.toString()} onValueChange={(value) => setReviewRating(parseInt(value))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <SelectItem key={rating} value={rating.toString()}>
                        <div className="flex items-center">
                          {renderStars(rating)}
                          <span className="ml-2">{rating}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Review (optional)</label>
                <Textarea
                  placeholder="Share your thoughts about this book..."
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  rows={4}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleSubmitReview}
                  disabled={isSubmittingReview}
                  className="btn-minimal"
                >
                  Submit Review
                </Button>
                <Button 
                  onClick={() => setShowReviewForm(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Reviews list */}
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <Star className="h-16 w-16 mx-auto mb-4 text-content-medium" />
              <p className="text-content-medium">No reviews yet. Be the first to review this book!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="card-minimal">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">{review.username}</h4>
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <time className="text-content-medium text-sm">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </time>
                  </div>
                  {review.content && (
                    <p className="text-content-dark leading-relaxed">{review.content}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;