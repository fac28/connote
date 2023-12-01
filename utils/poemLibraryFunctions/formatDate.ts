export const formatDate = (dateString: string | number | Date) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  };
  const formattedDate = new Date(dateString).toLocaleDateString(
    'en-GB',
    options
  );
  return formattedDate;
};
