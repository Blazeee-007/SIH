import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          password: string;
          name: string;
          role: 'student' | 'mentor' | 'admin';
          phone: string | null;
          bio: string | null;
          skills: string | null;
          resume_url: string | null;
          avatar_url: string | null;
          is_active: boolean;
          is_verified: boolean;
          login_attempts: number;
          locked_until: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      internships: {
        Row: {
          id: string;
          mentor_id: string;
          title: string;
          description: string;
          company: string;
          location: string | null;
          duration: string | null;
          stipend: string | null;
          requirements: string | null;
          skills_required: string | null;
          start_date: string | null;
          end_date: string | null;
          max_applicants: number;
          status: 'draft' | 'published' | 'closed' | 'completed';
          is_approved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['internships']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['internships']['Insert']>;
      };
    };
  };
};
