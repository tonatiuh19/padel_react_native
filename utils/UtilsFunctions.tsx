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
  disabledSlots: string[]
): string[] => {
  const slots = [];
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
