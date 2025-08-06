const DashboardPage = () => {
  const [stats, setStats] = useState({
    books: 0,
    blogs: 0,
    reviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [booksRes, blogsRes, reviewsRes] = await Promise.all([
          ApiService.get("/book/user/my-books"),
          ApiService.get("/blog/user/my-blogs"),
          ApiService.get("/review/user/my-reviews"),
        ]);

        setStats({
          books: booksRes.data?.length || 0,
          blogs: blogsRes.data?.length || 0,
          reviews: reviewsRes.data?.length || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-20">Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">My Books</p>
              <p className="text-3xl font-bold text-blue-600">{stats.books}</p>
            </div>
            <Book className="text-blue-600" size={40} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">My Blogs</p>
              <p className="text-3xl font-bold text-green-600">{stats.blogs}</p>
            </div>
            <FileText className="text-green-600" size={40} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">My Reviews</p>
              <p className="text-3xl font-bold text-yellow-600">
                {stats.reviews}
              </p>
            </div>
            <Star className="text-yellow-600" size={40} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/books/create"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <Plus size={18} />
              <span>Add New Book</span>
            </Link>
            <Link
              to="/blogs/create"
              className="flex items-center space-x-2 text-green-600 hover:text-green-800"
            >
              <Plus size={18} />
              <span>Write New Blog</span>
            </Link>
            <Link
              to="/authors/create"
              className="flex items-center space-x-2 text-purple-600 hover:text-purple-800"
            >
              <Plus size={18} />
              <span>Add New Author</span>
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <p className="text-gray-600">
            Your recent books and blogs will appear here.
          </p>
        </div>
      </div>
    </div>
  );
};
