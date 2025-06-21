import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>📚 Welcome to TaleTrail</h1>
      <p style={styles.subtext}>
        Track your reading, share blogs, and join the book community.
      </p>

      <div style={styles.buttonGroup}>
        <button onClick={() => navigate("/signup")} style={styles.button}>
          Sign Up
        </button>
        <button onClick={() => navigate("/login")} style={styles.button}>
          Login
        </button>
        <button onClick={() => navigate("/dashboard")} style={styles.button}>
          Dashboard
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "3rem",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "1rem",
  },
  subtext: {
    fontSize: "1rem",
    marginBottom: "2rem",
    color: "#666",
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  button: {
    padding: "0.8rem 1.5rem",
    fontSize: "1rem",
    cursor: "pointer",
    backgroundColor: "#1e90ff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    transition: "background-color 0.3s",
  },
};

export default Home;
