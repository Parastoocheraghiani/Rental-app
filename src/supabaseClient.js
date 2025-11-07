import { createClient } from "@supabase/supabase-js";

// آدرس و کلید پروژه‌ات در Supabase
const supabaseUrl = "https://atggpdceswwcfujmjxag.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0Z2dwZGNlc3d3Y2Z1am1qeGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MDYxNDUsImV4cCI6MjA3ODA4MjE0NX0.FXQvRhyvKVFobFTvqGmM1iL3tduk8_KUhGC7z0n_yv0";

export const supabase = createClient(supabaseUrl, supabaseKey);