import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Verificar se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variáveis de ambiente do Supabase não configuradas:')
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅' : '❌')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

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