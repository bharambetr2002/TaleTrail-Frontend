// src/supabaseClient.js

// Import the function to create a Supabase client instance
import { createClient } from "@supabase/supabase-js";

// Get Supabase project URL from environment variables (.env file)
// This keeps sensitive data out of the codebase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;

// Get the Supabase public (anon) API key from environment variables
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Create and export the Supabase client to use throughout the app
// This client will be used to interact with Supabase services (auth, database, storage, etc.)
export const supabase = createClient(supabaseUrl, supabaseKey);
