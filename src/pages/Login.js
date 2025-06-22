import React, { useState } from "react";
import { supabase } from "../supabaseClient"; // Import configured Supabase client
import { useNavigate } from "react-router-dom"; // For programmatic navigation

function Login() {
  // useState hooks to manage form inputs for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate(); // Hook to navigate to other routes

  // Function to handle login when user clicks the login button
  const handleLogin = async () => {
    // Supabase auth function to sign in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // If an error occurs during login, show an alert with the error message
    if (error) {
      alert(error.message);
    } else {
      // If login is successful, store the access token in localStorage
      localStorage.setItem("access_token", data.session.access_token);

      // Navigate to the dashboard after successful login
      navigate("/dashboard");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      {/* Input field for email */}
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />

      {/* Input field for password */}
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Button to trigger login function */}
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
}

export default Login;
