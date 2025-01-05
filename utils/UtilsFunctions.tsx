export const getDisabledSlots = (
  items: Record<string, { active: number; height: number; name: string }[]>,
  date: string
): string[] => {
  if (!items[date]) {
    return [];
  }

  const disabledSlots = items[date].map((item) => {
    const [startTime] = item.name.split(" - ");
    const time = new Date(startTime).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return time;
  });

  return disabledSlots;
};

export const generateDateTime = (date: string, time: string): string => {
  return `${date}T${time}`;
};

export const isEmptyObject = (obj: object): boolean => {
  return Object.keys(obj).length === 0;
};

export const formatTimeLabel = (time: string) => {
  if (time === "") {
    return "";
  }
  const [hour, minutes] = time.split(":");
  const hourInt = parseInt(hour, 10);
  const ampm = hourInt >= 12 ? "PM" : "AM";
  const formattedHour = hourInt % 12 || 12;
  const formattedTime = `${
    formattedHour < 10 ? `0${formattedHour}` : formattedHour
  }:${minutes} ${ampm}`;
  return formattedTime;
};

export const generateTimeSlots = (
  start: number,
  end: number,
  range: number,
  disabledSlots: string[],
  selectedDate: string
): string[] => {
  console.log("Selected Date", selectedDate);
  const slots = [];
  const now = new Date(selectedDate);
  console.log("Now", now);
  const currentDate = now.toISOString().split("T")[0]; // Get current date in "YYYY-MM-DD" format
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();

  slots.push("");
  for (let hour = start; hour <= end; hour += range) {
    const fullHour = Math.floor(hour);
    const minutes = (hour % 1) * 60;
    const formattedHour = fullHour < 10 ? `0${fullHour}` : fullHour;
    const formattedMinutes = minutes === 0 ? "00" : minutes;
    const time = `${formattedHour}:${formattedMinutes}:00`;
    if (!disabledSlots.includes(time)) {
      slots.push(time);
    }
  }
  return slots;
};

export const getFlagImage = (zone: string) => {
  switch (zone) {
    case "+52":
      return { uri: "https://garbrix.com/padel/assets/images/mx.png" };
    case "+1":
      return { uri: "https://garbrix.com/padel/assets/images/us.png" };
    default:
      return { uri: "https://garbrix.com/padel/assets/images/mx.png" };
  }
};

export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };
  // Convert the date to the local time zone
  const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return localDate.toLocaleDateString("es-MX", options);
};

export const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatFullDate = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);

  const dayNames = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const dayName = dayNames[date.getDay()];
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${dayName} ${day} de ${month}, ${year}`;
};

export const formatShortDate = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year

  return `${day}/${month}/${year}`;
};

export const formatTime = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

export const formatCurrency = (amount: number, currency: string = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const formatDateTime = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${day}-${month}-${year} ${formattedHours}:${formattedMinutes} ${ampm}`;
};
