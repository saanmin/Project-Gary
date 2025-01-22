export const getLastDayOfPreviousQuarter = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const quarterMonth = Math.floor(currentMonth / 3) * 3;
  const lastDay = new Date(currentYear, quarterMonth, 0);
  const year = lastDay.getFullYear();
  const month = String(lastDay.getMonth() + 1).padStart(2, '0');
  const day = String(lastDay.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getPreviousYearDate = (dateString, yearsBack = 1) => {
  if (!dateString) {
    return '';
  }

  try {
    const dateStringNoSpace = dateString.replace(/\s/g, '');
    const [year, month, day] = dateStringNoSpace.split('-');

    if (!year || !month || !day) {
      return '';
    }

    return `${parseInt(year) - yearsBack}년 ${month}월 ${day}일 기준`;
  } catch (error) {
    return '';
  }
};

export const formatDateInput = (input, prevInput) => {
  const isDeleting = input.length < prevInput.length;

  if (input.length > 8) {
    return null;
  }

  let displayValue = input;
  if (input.length >= 4) {
    displayValue = input.slice(0, 4) + ' - ' + input.slice(4);
  }
  if (input.length >= 6 && !isDeleting) {
    displayValue = displayValue.slice(0, 9) + ' - ' + input.slice(6);
  }

  if (isDeleting) {
    if (input.length === 4) {
      displayValue = input.slice(0, 4);
    } else if (input.length === 6) {
      displayValue = input.slice(0, 4) + ' - ' + input.slice(4, 6);
    }
  }

  return displayValue;
};

export const validateDate = (input) => {
  if (input.length !== 8) return false;

  const year = parseInt(input.slice(0, 4));
  const month = parseInt(input.slice(4, 6));
  const day = parseInt(input.slice(6, 8));

  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;
};
