export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          email: string | null
          role: 'admin' | 'user'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          email?: string | null
          role?: 'admin' | 'user'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          email?: string | null
          role?: 'admin' | 'user'
          created_at?: string
          updated_at?: string
        }
      }
      market_signals: {
        Row: {
          id: string
          asset_code: string
          asset_category: 'B3' | 'FOREX' | 'CRIPTO'
          signal_type: 'BUY' | 'SELL' | 'NEUTRAL'
          entry_price: number | null
          target_price: number | null
          stop_loss: number | null
          notes: string | null
          created_at: string
        }
      }
    }
  }
}
