//export const DOMAIN = "http://localhost:8015/api";
export const DOMAIN = "https://garbrix.com/padel/api/";

export interface ReservationCardProps {
  id_platforms_field: number;
  field: string;
  time: string;
  player: string;
  images: { uri: string }[];
}

/*Store*/
export interface AppState {
  platformFields: PlatformField;
  isLoading?: boolean;
  isError?: boolean;
}

export interface PlatformField {
  title: string;
  start_time: string;
  end_time: string;
  platforms_fields: PlatformsField[];
}

export interface PlatformsField {
  id_platforms_field: number;
  title: string;
  carrouselImages: CarrouselImage[];
  active_slots: ESlot[];
  idle_slots: ESlot[];
}

export interface ESlot {
  id_platforms_date_time_slot: number;
  id_platforms_field: number;
  platforms_date_time_start: Date;
  platforms_date_time_end: Date;
  active: number;
}

export interface CarrouselImage {
  name: string;
  path: string;
}
