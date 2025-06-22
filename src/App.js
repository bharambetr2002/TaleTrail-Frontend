import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // React Router for client-side routing
import Home from "./pages/Home"; // Home (Landing) Page
import Signup from "./pages/Signup"; // Signup Page
import Login from "./pages/Login"; // Login Page
import Dashboard from "./pages/Dashboard"; // Protected Dashboard Page

function App() {
  return (
    // Router wraps the entire app to enable routing functionality
    <Router>
      <Routes>
        {/* Define route for the home page */}
        <Route path="/" element={<Home />} />

        {/* Define route for the signup page */}
        <Route path="/signup" element={<Signup />} />

        {/* Define route for the login page */}
        <Route path="/login" element={<Login />} />

        {/* Define route for the dashboard page (should ideally be protected) */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
