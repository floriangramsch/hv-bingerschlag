export const convertDate = (date: Date) => {
  const formattedDate = date.toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return formattedDate + " Uhr"
};
