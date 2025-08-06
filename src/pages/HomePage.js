const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold text-gray-900 mb-6">
        Welcome to TaleTrail
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Track your reading, share blogs, and join the book community.
      </p>
      {!isAuthenticated && (
        <div className="flex justify-center space-x-4">
          <Link
            to="/signup"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg text-lg hover:bg-gray-300"
          >
            Login
          </Link>
        </div>
      )}
    </div>
  );
};
