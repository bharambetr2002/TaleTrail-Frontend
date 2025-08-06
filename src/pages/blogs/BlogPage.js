const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await ApiService.get("/blog");
      setBlogs(response.data || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading blogs...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blogs</h1>
        <Link
          to="/blogs/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Write Blog</span>
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-20">
          <FileText size={64} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">
            No blogs found. Write your first blog!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-2">{blog.title}</h3>
              <p className="text-gray-600 mb-4">
                {blog.content?.substring(0, 200)}...
              </p>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <div className="flex space-x-2">
                  <Link
                    to={`/blogs/${blog.id}/edit`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit
                  </Link>
                  <button className="text-red-600 hover:text-red-800 text-sm">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
