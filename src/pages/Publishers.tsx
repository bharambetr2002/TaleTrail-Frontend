import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService, Publisher } from '@/services/api';
import { Building2, Calendar, BookOpen, MapPin } from 'lucide-react';

const Publishers: React.FC = () => {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPublishers = async () => {
      try {
        const response = await apiService.getPublishers();
        if (response.success) {
          setPublishers(response.data);
        }
      } catch (error) {
        console.error('Error fetching publishers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublishers();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-semibold mb-4">Publishers</h1>
          <p className="text-content-medium">
            Explore the publishing houses behind great literature
          </p>
        </div>

        {/* Publishers Grid */}
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
        ) : publishers.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 mx-auto mb-4 text-content-medium" />
            <h3 className="text-xl font-serif font-semibold mb-2">No publishers found</h3>
            <p className="text-content-medium">Check back later for more publishers</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishers.map((publisher) => (
              <Link key={publisher.id} to={`/publishers/${publisher.id}`} className="group">
                <div className="card-minimal hover:shadow-lg transition-all duration-300">
                  <h3 className="text-xl font-serif font-semibold mb-3 group-hover:text-primary transition-colors">
                    {publisher.name}
                  </h3>
                  
                  {publisher.foundedYear && (
                    <div className="flex items-center text-content-medium text-sm mb-3">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Founded {publisher.foundedYear}</span>
                    </div>
                  )}
                  
                  {publisher.address && (
                    <div className="flex items-center text-content-medium text-sm mb-3">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{publisher.address}</span>
                    </div>
                  )}
                  
                  {publisher.bookCount !== undefined && (
                    <div className="flex items-center text-content-medium text-sm mb-3">
                      <BookOpen className="h-4 w-4 mr-2" />
                      <span>{publisher.bookCount} {publisher.bookCount === 1 ? 'book' : 'books'}</span>
                    </div>
                  )}
                  
                  {publisher.description && (
                    <p className="text-content-medium text-sm line-clamp-3">
                      {publisher.description}
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

export default Publishers;