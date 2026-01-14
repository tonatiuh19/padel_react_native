// Type definitions for Classes feature

export interface PlatformField {
  id_platforms_field: number;
  name: string;
  is_active: boolean;
}

export interface ClassEvent {
  id: number;
  id_platforms_field: number;
  start_date_time: string;
  end_date_time: string;
  title: string;
  description?: string;
  status: string;
}

export interface ClassReservation {
  id: number;
  user_id: number;
  platforms_date_time_start: string;
  platforms_date_time_end: string;
  id_platforms_field: number;
  status: string;
  created_at: string;
}
