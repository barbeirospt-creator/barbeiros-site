import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mlxugdfcmxxrndvglmew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1seHVnZGZjbXh4cm5kdmdsbWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5Nzk4ODIsImV4cCI6MjA4NjU1NTg4Mn0.9NfXorzRRRXMscvNAUjuWlF7R92yJ0ewm9wFyYVzx4g';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
