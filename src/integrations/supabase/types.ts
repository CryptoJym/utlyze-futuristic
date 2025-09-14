export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]
export type Database = {
  __InternalSupabase: { PostgrestVersion: "12.2.3 (519615d)" }
  public: {
    Tables: {
      lead_forms: {
        Row: { id?: string; created_at?: string; updated_at?: string; full_name?: string; company_name?: string; industry?: string; title?: string; value_message?: string; ideal_lead?: string; lead_capacity?: string; spend_range?: string; success_rate?: string; pain_points?: string; phone?: string | null; company_url?: string | null; additional_info?: string | null; email?: string | null; source_site?: string | null; path?: string | null; utm_source?: string | null; utm_medium?: string | null; utm_campaign?: string | null; utm_term?: string | null; utm_content?: string | null; ref?: string | null; created_day_utc?: string | null }
        Insert: Partial<Database["public"]["Tables"]["lead_forms"]["Row"]>
        Update: Partial<Database["public"]["Tables"]["lead_forms"]["Row"]>
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
