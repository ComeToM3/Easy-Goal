export default function DayFilter() {
    const currentDate = new Date();
  
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
  
    const formattedDate = `${year}-${month}-${day}`;
  
    const startOfDay = new Date(`${formattedDate}T00:00:00Z`);
    const endOfDay = new Date(`${formattedDate}T23:59:59Z`);
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);

    return {
      startOfDay,
      endOfDay,
      startOfMonth,
      endOfMonth

    };
  }
  