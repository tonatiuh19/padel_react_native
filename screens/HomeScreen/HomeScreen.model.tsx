//export const DOMAIN = "http://localhost:8015/api";
export const DOMAIN = "https://garbrix.com/padel/api/";

export interface ReservationCardProps {
  id_platforms_field: number;
  title: string;
  time: string;
  player: string;
  images: { uri: string }[];
  field: PlatformsField;
}

/*Store*/
export interface AppState {
  platformFields: PlatformField;
  platformsFields: EPlatformField;
  isLoading?: boolean;
  isError?: boolean;
}

export interface PlatformField {
  title: string;
  today: string;
  start_time: string;
  end_time: string;
  platforms_fields: PlatformsField[];
}

export interface PlatformsField {
  id_platforms_field: number;
  title: string;
  today: string;
  carrouselImages: CarrouselImage[];
}

export interface EPlatformField {
  id_platforms_field: number;
  title: string;
  today: string;
  active_slots: ESlot[];
  idle_slots: ESlot[];
  slots: { [key: string]: Slot[] };
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

export interface Slot {
  active: number;
  height: number;
  name: string;
}
