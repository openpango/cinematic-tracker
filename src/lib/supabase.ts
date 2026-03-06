import { createClient } from '@supabase/supabase-js';

// These should normally come from environment variables (.env.local)
// For scaffolding without a real backend instance yet, these are placeholders
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://svambyckwxqhaixjlerq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2YW1ieWNrd3hxaGFpeGpsZXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NTgzNzEsImV4cCI6MjA4ODMzNDM3MX0.bmaXp0ZNXAzF0fJSpqxwOCJ6AEoQs00Fk6g5q121kQs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
