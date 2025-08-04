import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      frases: {
        Row: {
          id: number
          frase: string | null
          estado: string | null
          created_at: string
        }
        Insert: {
          id?: number
          frase?: string | null
          estado?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          frase?: string | null
          estado?: string | null
          created_at?: string
        }
      }
    }
  }
}