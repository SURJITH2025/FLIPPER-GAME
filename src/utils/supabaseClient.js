
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tpzqgouypcpobmzvvlen.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwenFnb3V5cGNwb2JtenZ2bGVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyOTk0MjIsImV4cCI6MjA4NTg3NTQyMn0.6K114cNKAuGG8mn1bD6mg_tm-c8mpwZy-Q7WA3lL_AU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
