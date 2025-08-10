const API_BASE_URL = 'https://taletrail-backend.onrender.com/api';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: any;
}

interface User {
  id: string;
  email: string;
  fullName: string;
  username: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface Book {
  id: string;
  title: string;
  description?: string;
  language?: string;
  coverImageUrl?: string;
  publicationYear?: number;
  publisherId: string;
  publisherName: string;
  authors: Author[];
}

interface Author {
  id: string;
  name: string;
  bio?: string;
  birthDate?: string;
  deathDate?: string;
  bookCount?: number;
}

interface Publisher {
  id: string;
  name: string;
  description?: string;
  address?: string;
  foundedYear?: number;
  bookCount?: number;
}

interface UserBook {
  id: string;
  bookId: string;
  bookTitle: string;
  bookCoverUrl?: string;
  readingStatus: 'ToRead' | 'InProgress' | 'Completed' | 'Dropped';
  progress: number;
  startedAt?: string;
  completedAt?: string;
  addedAt: string;
}

interface Review {
  id: string;
  userId: string;
  username: string;
  bookId: string;
  bookTitle: string;
  rating: number;
  content?: string;
  createdAt: string;
}

interface BlogPost {
  id: string;
  userId: string;
  username: string;
  title: string;
  content: string;
  likeCount: number;
  isLikedByCurrentUser: boolean;
  createdAt: string;
  updatedAt: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('taletrail_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: this.getAuthHeaders(),
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async signup(email: string, password: string, fullName: string, username: string): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName, username }),
    });
  }

  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Books
  async getBooks(search?: string): Promise<ApiResponse<Book[]>> {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.request<Book[]>(`/book${params}`);
  }

  async getBookById(id: string): Promise<ApiResponse<Book>> {
    return this.request<Book>(`/book/${id}`);
  }

  async getBooksByAuthor(authorId: string): Promise<ApiResponse<Book[]>> {
    return this.request<Book[]>(`/book/by-author/${authorId}`);
  }

  // Authors
  async getAuthors(): Promise<ApiResponse<Author[]>> {
    return this.request<Author[]>('/author');
  }

  async getAuthorById(id: string): Promise<ApiResponse<Author>> {
    return this.request<Author>(`/author/${id}`);
  }

  // Publishers
  async getPublishers(): Promise<ApiResponse<Publisher[]>> {
    return this.request<Publisher[]>('/publisher');
  }

  async getPublisherById(id: string): Promise<ApiResponse<Publisher>> {
    return this.request<Publisher>(`/publisher/${id}`);
  }

  // User Library (requires auth)
  async getMyBooks(): Promise<ApiResponse<UserBook[]>> {
    return this.request<UserBook[]>('/userbook/my-books');
  }

  async addBookToLibrary(bookId: string, readingStatus: string, progress: number = 0): Promise<ApiResponse<any>> {
    return this.request('/userbook', {
      method: 'POST',
      body: JSON.stringify({ bookId, readingStatus, progress }),
    });
  }

  async updateBookStatus(bookId: string, readingStatus: string, progress: number): Promise<ApiResponse<any>> {
    return this.request(`/userbook/${bookId}`, {
      method: 'PUT',
      body: JSON.stringify({ readingStatus, progress }),
    });
  }

  async removeBookFromLibrary(bookId: string): Promise<ApiResponse<any>> {
    return this.request(`/userbook/${bookId}`, {
      method: 'DELETE',
    });
  }

  // Reviews
  async getBookReviews(bookId: string): Promise<ApiResponse<Review[]>> {
    return this.request<Review[]>(`/review/book/${bookId}`);
  }

  async createReview(bookId: string, rating: number, content?: string): Promise<ApiResponse<Review>> {
    return this.request<Review>('/review', {
      method: 'POST',
      body: JSON.stringify({ bookId, rating, content }),
    });
  }

  async updateReview(reviewId: string, rating: number, content?: string): Promise<ApiResponse<Review>> {
    return this.request<Review>(`/review/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify({ rating, content }),
    });
  }

  async deleteReview(reviewId: string): Promise<ApiResponse<any>> {
    return this.request(`/review/${reviewId}`, {
      method: 'DELETE',
    });
  }

  // Blogs
  async getBlogs(userId?: string): Promise<ApiResponse<BlogPost[]>> {
    const params = userId ? `?userId=${userId}` : '';
    return this.request<BlogPost[]>(`/blog${params}`);
  }

  async getBlogById(id: string): Promise<ApiResponse<BlogPost>> {
    return this.request<BlogPost>(`/blog/${id}`);
  }

  async createBlog(title: string, content: string): Promise<ApiResponse<BlogPost>> {
    return this.request<BlogPost>('/blog', {
      method: 'POST',
      body: JSON.stringify({ title, content }),
    });
  }

  async updateBlog(blogId: string, title: string, content: string): Promise<ApiResponse<BlogPost>> {
    return this.request<BlogPost>(`/blog/${blogId}`, {
      method: 'PUT',
      body: JSON.stringify({ title, content }),
    });
  }

  async deleteBlog(blogId: string): Promise<ApiResponse<any>> {
    return this.request(`/blog/${blogId}`, {
      method: 'DELETE',
    });
  }

  async likeBlog(blogId: string): Promise<ApiResponse<any>> {
    return this.request(`/blog-like/${blogId}`, {
      method: 'POST',
    });
  }

  async unlikeBlog(blogId: string): Promise<ApiResponse<any>> {
    return this.request(`/blog-like/${blogId}`, {
      method: 'DELETE',
    });
  }

  // User Profile
  async getUserProfile(): Promise<ApiResponse<User>> {
    return this.request<User>('/user/profile');
  }

  async updateUserProfile(fullName: string, username: string, bio?: string, avatarUrl?: string): Promise<ApiResponse<User>> {
    return this.request<User>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify({ fullName, username, bio, avatarUrl }),
    });
  }

  async getPublicProfile(username: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/profile/${username}`);
  }
}

export const apiService = new ApiService();
export type { User, Book, Author, Publisher, UserBook, Review, BlogPost, AuthResponse, ApiResponse };