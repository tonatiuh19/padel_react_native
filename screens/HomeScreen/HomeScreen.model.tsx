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
  schedule: ScheduleState;
  payment: PaymentState;
  disabledSlots: DisabledSlotsState;
  userInfo: UserState;
  reservations: Reservations[];
  isLoading?: boolean;
  isError?: boolean;
}

export interface ScheduleState {
  isDayEmpty: boolean;
  markedActiveDay: number;
}

export interface PaymentState {
  id_platforms_date_time_slot?: number;
  id_platforms_field: number;
  platforms_date_time_start: string;
  platforms_date_time_end?: string;
  active: number;
  stripe_id?: string;
}

export interface DisabledSlotsState {
  disabledSlots: string[];
  today: string;
}

export interface UserState {
  isSignedIn: boolean;
  isUserExist: boolean;
  isCodeSent: boolean;
  isIncorrectCode: boolean;
  isUserValidated: boolean;
  info: UserInfo;
}

export interface UserInfo {
  id_platforms_user: number;
  full_name: string;
  age: number;
  date_of_birth: string;
  email: string;
  phone_number: string;
  phone_number_code: string;
  stripe_id: string;
  type: number;
  date_created: string;
  id_platforms: number;
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
  markedDates: { [key: string]: MarkedDate };
  active_slots?: ESlot[];
  idle_slots?: ESlot[];
  slots: { [key: string]: Slot[] };
}

export interface MarkedDate {
  marked: boolean;
  dotColor: string;
  activeOpacity: number;
  id_platforms_disabled_date: number;
  start_date_time: Date;
  end_date_time: Date;
  active: number;
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

export interface Reservations {
  id_platforms_date_time_slot: number;
  id_platforms_field: number;
  id_platforms_user: number;
  platforms_date_time_start: string;
  platforms_date_time_end: string;
  active: number;
  stripe_id: string;
  validated: number;
}
