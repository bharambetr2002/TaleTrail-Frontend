const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await ApiService.get("/book");
      setBooks(response.data || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading books...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Books</h1>
        <Link
          to="/books/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Add Book</span>
        </Link>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-20">
          <Book size={64} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No books found. Add your first book!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book.id} className="bg-white p-6 rounded-lg shadow-md">
              {book.coverUrl && (
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
              <p className="text-gray-600 mb-2">{book.description}</p>
              {book.publicationYear && (
                <p className="text-sm text-gray-500">
                  Published: {book.publicationYear}
                </p>
              )}
              <div className="mt-4 flex space-x-2">
                <Link
                  to={`/books/${book.id}/edit`}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this book?")) {
                      // Delete functionality would go here
                    }
                  }}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
