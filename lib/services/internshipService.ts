import { supabase } from '../supabase/client';

export interface Internship {
  id: string;
  mentor_id: string;
  title: string;
  description: string;
  company: string;
  location?: string;
  duration?: string;
  stipend?: string;
  requirements?: string;
  skills_required?: string;
  start_date?: string;
  end_date?: string;
  max_applicants: number;
  status: 'draft' | 'published' | 'closed' | 'completed';
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export async function createInternship(data: Omit<Internship, 'id' | 'created_at' | 'updated_at' | 'is_approved'>): Promise<Internship | null> {
  const { data: internship, error } = await supabase
    .from('internships')
    .insert({
      ...data,
      is_approved: false
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating internship:', error);
    return null;
  }

  return internship;
}

export async function getInternshipById(id: string): Promise<Internship | null> {
  const { data, error } = await supabase
    .from('internships')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function getAllInternships(filters?: {
  mentor_id?: string;
  status?: string;
  is_approved?: boolean;
}): Promise<Internship[]> {
  let query = supabase.from('internships').select('*');

  if (filters?.mentor_id) {
    query = query.eq('mentor_id', filters.mentor_id);
  }

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.is_approved !== undefined) {
    query = query.eq('is_approved', filters.is_approved);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching internships:', error);
    return [];
  }

  return data || [];
}

export async function updateInternship(id: string, updates: Partial<Internship>): Promise<Internship | null> {
  const { data, error } = await supabase
    .from('internships')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function deleteInternship(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('internships')
    .delete()
    .eq('id', id);

  return !error;
}
