import React, { useState } from "react";
import { supabase } from "../supabaseClient"; // Import configured Supabase client
import { useNavigate } from "react-router-dom"; // For redirecting after signup

function Signup() {
  // useState hooks to manage form input for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate(); // Hook for programmatic navigation

  // Function to handle user signup
  const handleSignup = async () => {
    // Call Supabase's signUp method with email and password
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    // Handle error scenario — display the error message in an alert
    if (error) {
      alert(error.message);
    } else {
      // If signup is successful, notify user and redirect to login page
      alert("Signup successful! Check your email."); // Supabase sends verification email by default
      navigate("/login"); // Navigate to login page
    }
  };

  return (
    <div>
      <h2>Signup</h2>

      {/* Input for email address */}
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />

      {/* Input for password */}
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Button to trigger signup process */}
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
}

export default Signup;
