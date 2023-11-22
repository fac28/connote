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
      poems: {
        Row: {
          author: string | null
          content: string | null
          first_prompt_id: number | null
          id: number
          name: string | null
          second_prompt_id: number | null
          third_prompt_id: number | null
        }
        Insert: {
          author?: string | null
          content?: string | null
          first_prompt_id?: number | null
          id?: never
          name?: string | null
          second_prompt_id?: number | null
          third_prompt_id?: number | null
        }
        Update: {
          author?: string | null
          content?: string | null
          first_prompt_id?: number | null
          id?: never
          name?: string | null
          second_prompt_id?: number | null
          third_prompt_id?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      prompts: {
        Row: {
          follow_up_prompt: string | null
          highlighting_format: string | null
          id: number
          initial_prompt: string | null
        }
        Insert: {
          follow_up_prompt?: string | null
          highlighting_format?: string | null
          id?: never
          initial_prompt?: string | null
        }
        Update: {
          follow_up_prompt?: string | null
          highlighting_format?: string | null
          id?: never
          initial_prompt?: string | null
        }
        Relationships: []
      }
      reacts: {
        Row: {
          id: number
          reacter_id: number | null
          response_id: number | null
          type: string | null
        }
        Insert: {
          id?: never
          reacter_id?: number | null
          response_id?: number | null
          type?: string | null
        }
        Update: {
          id?: never
          reacter_id?: number | null
          response_id?: number | null
          type?: string | null
        }
        Relationships: []
      }
      responses: {
        Row: {
          id: number
          poem_id: number | null
          prompt_id: number | null
          response_selected: string | null
          response_written: string | null
          user_id: number | null
        }
        Insert: {
          id?: never
          poem_id?: number | null
          prompt_id?: number | null
          response_selected?: string | null
          response_written?: string | null
          user_id?: number | null
        }
        Update: {
          id?: never
          poem_id?: number | null
          prompt_id?: number | null
          response_selected?: string | null
          response_written?: string | null
          user_id?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
