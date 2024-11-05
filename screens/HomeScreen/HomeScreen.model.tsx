//export const DOMAIN = "http://localhost:8015/api";
export const DOMAIN = "https://garbrix.com/padel/api/";

export interface ReservationCardProps {
  field: string;
  time: string;
  player: string;
  images: { uri: string }[];
}

/*Store*/
export interface AppState {
  platformFields: PlatformField[];
  isLoading?: boolean;
  isError?: boolean;
}

export interface PlatformField {
  id_platforms_field: number;
  id_platform: number;
  title: string;
  active: boolean;
}
