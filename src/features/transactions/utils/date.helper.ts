export function formatPeriod(start: Date, end: Date) {
  const formatDate = (date: Date) =>
    date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
    });

  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  const year =
    startYear === endYear
      ? `${startYear}`
      : `${startYear}-${endYear}`;

  return {
    label: `${formatDate(start)} - ${formatDate(end)}`,
    year,
  };
}