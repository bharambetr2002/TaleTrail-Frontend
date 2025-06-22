import React from "react";
import { useNavigate } from "react-router-dom";

// Home component serves as the landing page of the TaleTrail app
const Home = () => {
  // useNavigate hook from react-router-dom allows navigation programmatically
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {/* Main heading */}
      <h1 style={styles.heading}>📚 Welcome to TaleTrail</h1>

      {/* Subtext describing the app's purpose */}
      <p style={styles.subtext}>
        Track your reading, share blogs, and join the book community.
      </p>

      {/* Group of navigation buttons */}
      <div style={styles.buttonGroup}>
        {/* Navigate to Sign Up page */}
        <button onClick={() => navigate("/signup")} style={styles.button}>
          Sign Up
        </button>

        {/* Navigate to Login page */}
        <button onClick={() => navigate("/login")} style={styles.button}>
          Login
        </button>

        {/* Navigate to Dashboard (assuming user is authenticated) */}
        <button onClick={() => navigate("/dashboard")} style={styles.button}>
          Dashboard
        </button>
      </div>
    </div>
  );
};

// Inline styling object for the component
const styles = {
  container: {
    padding: "3rem", // Outer spacing
    textAlign: "center", // Centered content
    fontFamily: "Arial, sans-serif", // Font style
  },
  heading: {
    fontSize: "2rem", // Large heading
    marginBottom: "1rem", // Space below heading
  },
  subtext: {
    fontSize: "1rem", // Subheading font size
    marginBottom: "2rem", // Space below subtext
    color: "#666", // Gray color text
  },
  buttonGroup: {
    display: "flex", // Flexbox layout for buttons
    gap: "1rem", // Space between buttons
    justifyContent: "center", // Center align buttons
    flexWrap: "wrap", // Allow buttons to wrap on smaller screens
  },
  button: {
    padding: "0.8rem 1.5rem", // Button size
    fontSize: "1rem", // Text size inside button
    cursor: "pointer", // Pointer cursor on hover
    backgroundColor: "#1e90ff", // Blue background
    color: "#fff", // White text
    border: "none", // No border
    borderRadius: "5px", // Rounded corners
    transition: "background-color 0.3s", // Smooth hover transition
  },
};

export default Home;
