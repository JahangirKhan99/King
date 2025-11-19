import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface PassportApplication {
  id?: string;
  case_no: string;
  application_date: string;
  call_date?: string;
  name: string;
  nic_no: string;
  address: string;
  service_type: string;
  fresh_passport_fee: number;
  renewal_fee: number;
  endorsement_fee: number;
  visa_fee: number;
  citizenship_fee: number;
  other_fee: number;
  total_amount: number;
  amount_in_words: string;
  bank_charges: number;
  created_at?: string;
}
