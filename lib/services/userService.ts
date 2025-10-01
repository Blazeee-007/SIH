import { supabase } from '../supabase/client';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'mentor' | 'admin';
  phone?: string | null;
  bio?: string | null;
  skills?: string | null;
  resume_url?: string | null;
  avatar_url?: string | null;
  is_active?: boolean;
  is_verified?: boolean;
}

export async function createUser(userData: {
  email: string;
  password: string;
  name: string;
  role: 'student' | 'mentor';
  phone?: string;
  bio?: string;
  skills?: string;
}): Promise<User | null> {
  const hashedPassword = await bcrypt.hash(userData.password, 12);

  const { data, error } = await supabase
    .from('users')
    .insert({
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      role: userData.role,
      phone: userData.phone || null,
      bio: userData.bio || null,
      skills: userData.skills || null,
      is_active: true,
      is_verified: false,
      login_attempts: 0
    })
    .select('id, email, name, role, phone, bio, skills, avatar_url, is_active, is_verified')
    .maybeSingle();

  if (error) {
    console.error('Error creating user:', error);
    return null;
  }

  return data;
}

export async function getUserByEmail(email: string): Promise<(User & { password: string; login_attempts: number; locked_until: string | null }) | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as any;
}

export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, name, role, phone, bio, skills, avatar_url, resume_url, is_active, is_verified')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select('id, email, name, role, phone, bio, skills, avatar_url, resume_url, is_active, is_verified')
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export async function incrementLoginAttempts(id: string): Promise<void> {
  await supabase.rpc('increment_login_attempts', { user_id: id });
}

export async function resetLoginAttempts(id: string): Promise<void> {
  await supabase
    .from('users')
    .update({ login_attempts: 0, locked_until: null })
    .eq('id', id);
}

export async function lockUser(id: string, lockDurationMs: number): Promise<void> {
  const lockedUntil = new Date(Date.now() + lockDurationMs).toISOString();
  await supabase
    .from('users')
    .update({ locked_until: lockedUntil })
    .eq('id', id);
}
