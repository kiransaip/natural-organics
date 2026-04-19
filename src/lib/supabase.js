import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rrvuxhszckyyxptegssk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJydnV4aHN6Y2t5eXhwdGVnc3NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MjA1MDksImV4cCI6MjA5MjE5NjUwOX0.PdxIAxsByUsFk3wXYju6jobcJPoU_em-6p3m5u5d8ns';

export const supabase = createClient(supabaseUrl, supabaseKey);
