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
  const slots = [];
  const now = new Date();
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
    if (
      !disabledSlots.includes(time) &&
      (selectedDate > currentDate ||
        (selectedDate === currentDate &&
          (fullHour > currentHour ||
            (fullHour === currentHour && minutes > currentMinutes))))
    ) {
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
  const day = date.getDate().toString().padStart(2, "0");
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
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day} de ${month} de ${year}`;
};

export const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
