import React, { useEffect, useState } from "react";
import axios from "axios";

// Dashboard component displays the logged-in user's data
function Dashboard() {
  // State to store user data after fetching from backend
  const [user, setUser] = useState(null);

  // useEffect runs once when the component mounts
  useEffect(() => {
    // Retrieve JWT access token from local storage
    const token = localStorage.getItem("access_token");

    // If token doesn't exist, exit early (user likely not logged in)
    if (!token) return;

    // Make authenticated request to fetch the current user's data
    axios
      .get("http://localhost:5003/api/auth/me", {
        headers: {
          // Set the Authorization header with Bearer token
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // On success, set the user data into state
        setUser(res.data);
      })
      .catch((err) => {
        // On error, log it and notify user
        console.error(err); // Developer-friendly error log
        console.log("Token:", token); // For debugging purposes only

        // Alert user about token issues
        alert("Token expired or invalid");
      });
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <div>
      <h2>Dashboard</h2>

      {/* If user data is loaded, display it in formatted JSON */}
      {user ? (
        <pre>{JSON.stringify(user, null, 2)}</pre>
      ) : (
        // While loading, show a simple message
        <p>Loading user...</p>
      )}
    </div>
  );
}

export default Dashboard;
