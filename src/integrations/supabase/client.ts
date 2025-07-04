
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kealkesdbjnjixjexwuw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlYWxrZXNkYmpuaml4amV4d3V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1NzE1NzUsImV4cCI6MjA2MzE0NzU3NX0.r0CHSNZhxwVCaQxbtyfKySuiy2sswJyx-RNj-B4pA24";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
