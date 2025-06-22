import React from "react"; // Import React core library
import ReactDOM from "react-dom/client"; // Import ReactDOM for rendering in React 18+
import App from "./App"; // Import the main App component

// Create a root DOM node where the React app will be mounted
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the App component into the root element
root.render(<App />);
