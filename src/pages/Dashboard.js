import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    axios
      .get("http://localhost:5003/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error(err);
        console.log("Token:", token); // It should be a long string, not null/undefined

        alert("Token expired or invalid");
      });
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {user ? (
        <pre>{JSON.stringify(user, null, 2)}</pre>
      ) : (
        <p>Loading user...</p>
      )}
    </div>
  );
}

export default Dashboard;
