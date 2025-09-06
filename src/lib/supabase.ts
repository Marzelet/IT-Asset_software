import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Database features will be limited.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Database connection status
export const checkDatabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('_health_check').select('*').limit(1);
    return { connected: !error, error: error?.message };
  } catch (error) {
    return { 
      connected: false, 
      error: 'Database connection not configured. Please connect to Supabase.' 
    };
  }
};

// Initialize database tables if they don't exist
export const initializeDatabase = async () => {
  try {
    // This will be handled by Supabase migrations
    console.log('Database initialization should be handled by Supabase migrations');
    return { success: true };
  } catch (error) {
    console.error('Database initialization failed:', error);
    return { success: false, error };
  }
};