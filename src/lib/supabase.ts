import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Service {
  id: string;
  name: string;
  type: 'physical' | 'teleconsultation';
  address?: string;
  city?: string;
  state: string;
  phone?: string;
  teleconsult_link?: string;
  schedule?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_name: string;
  service_name: string;
  amount: number;
  status: 'paid' | 'pending' | 'cancelled';
  payment_date?: string;
  due_date?: string;
  receipt_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
