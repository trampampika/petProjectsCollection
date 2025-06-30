import { FC, useState, useEffect, useRef } from "react";
import "./MoodCalendarStyles.css";
import { MoodDay } from "./MoodDay";
import { IMoodDay } from "../boards/types";
import { IMoodCalendar } from "../boards/types";

export const MoodCalendar: FC = () => {

  const [moodCalendar, setMoodCalendar] = useState<IMoodCalendar[]>([{moodDays:[], year: "", month: ""}]);

  const [year, setYear] = useState("");

  const [selectedMonth, setSelectedMonth] = useState<string>("");



  const handleCalendarChange = (newYear:string, newMonth:string, newMoodDay: IMoodDay[]) => {
      const newMoodCalendar = structuredClone(moodCalendar);

      newMoodCalendar[0].month = newMonth;
      newMoodCalendar[0].year = newYear;
      newMoodCalendar[0].moodDays = newMoodDay;
      setMoodCalendar(newMoodCalendar);
  };

  function getDataFromLocalStorage(key: string) {
    const dataFromLocalStorage = localStorage.getItem(key);

    let localVariableForParsing = [];
    if (dataFromLocalStorage !== null) {
      try {
        localVariableForParsing = JSON.parse(dataFromLocalStorage);
      } catch (error) {
          console.error(`Ошибка при парсинге данных из ${key}:`, error);
      }
    }

    return localVariableForParsing;
}



useEffect(() => {
  const loadSavedData = () => {
    const savedData = getDataFromLocalStorage('savedData');

    if (savedData && Object.keys(savedData).length > 0) {
      handleCalendarChange(savedData.year, savedData.month, savedData.moodDays);
      setYear(savedData.year);
      setSelectedMonth(savedData.month);
    } else {
      initializeCurrentMonthData();
    }
  };

  const initializeCurrentMonthData = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();
    const currentMonth = monthsNames[currentDate.getMonth()];

    setYear(currentYear);
    setSelectedMonth(currentMonth);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const monthDays = generateMonthDays(daysInMonth);

    handleCalendarChange(currentYear, currentMonth, monthDays);
  };

  const generateMonthDays = (daysInMonth: number) => {
    return Array.from({ length: daysInMonth }, (_, index) => ({
      id: `${index + 1}`,
      dayOfTheMonth: index + 1,
      isMoodChoosing: false,
      dayStyle: 'noEmoji',
    }));
  };

  loadSavedData();
}, []);


    const monthsNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];






    function getMonthIndexByName(monthName: string): number {
      return monthsNames.indexOf(monthName);
    }

    function getDaysInMonthByNameAndYear(monthName: string, year: string): number {
      const monthIndex = getMonthIndexByName(monthName) + 1;
      const numericYear = parseInt(year, 10);
      const lastDayOfMonth = new Date(numericYear, monthIndex, 0);

      return lastDayOfMonth.getDate();
    }


    const handleStartMoodSelection = (dayId: string) => {
      const isNoMoodSelected = moodCalendar[0].moodDays.every((day) => !day.isMoodChoosing);

      if (isNoMoodSelected) {
        const updatedMoodDays = structuredClone(moodCalendar[0].moodDays);
        const selectedDayIndex = updatedMoodDays.findIndex((day) => day.id === dayId);

        if (selectedDayIndex !== -1) {
          const selectedDay = updatedMoodDays[selectedDayIndex];
          selectedDay.isMoodChoosing = true;
          handleMoodDayChange(updatedMoodDays);
        }
      }
    };

    const handleMoodDayChange = (newMoodDay: IMoodDay[]) => {
      const newMoodCalendar = structuredClone(moodCalendar);
      structuredClone(moodCalendar);
      newMoodCalendar[0].moodDays = newMoodDay;
      setMoodCalendar(newMoodCalendar);
    };

    const handleFinishMoodSelection = (dayId: string, selectedMoodStyle: string) => {
      const updatedMoodDays = structuredClone(moodCalendar[0].moodDays);
      const selectedDayIndex = updatedMoodDays.findIndex((day) => day.id === dayId);

      if (selectedDayIndex !== -1) {
        const selectedDay = updatedMoodDays[selectedDayIndex];
        selectedDay.isMoodChoosing = false;
        selectedDay.dayStyle = selectedMoodStyle;
        handleMoodDayChange(updatedMoodDays);
      }
    };

    const handleClickOutside = () => {
      const moodDaysCopy = structuredClone(moodCalendar[0].moodDays);
      moodDaysCopy.forEach((item) => {
        item.isMoodChoosing = false; });
        handleMoodDayChange(moodDaysCopy);
      }

      const moodDayElements = moodCalendar[0]?.moodDays?.map((day) => (
        <MoodDay
          key={day.id}
          dayId={day.id}
          dayOfTheMonth={day.dayOfTheMonth}
          dayStyle={day.dayStyle}
          isMoodChoosing={day.isMoodChoosing}
          onStartChoosing={handleStartMoodSelection}
          onFinishChoosing={handleFinishMoodSelection}
          onHandleClickOutside={handleClickOutside}
        />
      ));

  const months: string[] = monthsNames;

  const [isOpen, setIsOpen] = useState<boolean>(false);


const toggleDropdown = () => {
  setIsOpen(!isOpen);
};

const selectMonth = (month: string) => {
  setSelectedMonth(month);
  setIsOpen(false);
};

const optionsMenu = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  const handleClick = (event: MouseEvent) => {
    if (isOpen && !optionsMenu.current?.contains(event.target as Node | null)) {
      setIsOpen(false);
    }
  };

  document.addEventListener('click', handleClick);
  return () => {
    document.removeEventListener('click', handleClick);
  };
}, [isOpen]);



const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const inputValue = event.target.value;
  if (inputValue.length <= 4) {
    setYear(inputValue);
  }
};


async function getFilteredObject(year: string, month: string) {
  try {
    const response = await fetch(
      `http://localhost:3001/api/objects?year=${encodeURIComponent(year)}&month=${encodeURIComponent(month)}`
    );
    if (!response.ok) {
      throw new Error(`Ошибка при получении данных: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Произошла ошибка:', error);
  }
}

useEffect(() => {
  const fetchAndUpdateCalendarData = async () => {
    const currentYear = year;
    const currentMonth = selectedMonth;

    try {
      const filteredData = await getFilteredObject(currentYear, currentMonth);

      if (Object.keys(filteredData).length === 0) {
        const daysInMonth = getDaysInMonthByNameAndYear(currentMonth, currentYear);
        const defaultDays = generateDefaultDays(daysInMonth);

        handleCalendarChange(currentYear, currentMonth, defaultDays);
      } else {
        setMoodCalendar(filteredData);
      }
    } catch (error) {
      console.error("Error fetching or processing calendar data:", error);
    }
  };

  const generateDefaultDays = (daysInMonth: number) => {
    return Array.from({ length: daysInMonth }, (_, index) => ({
      id: `${index + 1}`,
      dayOfTheMonth: index + 1,
      isMoodChoosing: false,
      dayStyle: "noEmoji",
    }));
  };

  fetchAndUpdateCalendarData();
}, [year, selectedMonth]);




const sendHardcode = () => {
  updateCalendarOnServer(moodCalendar);
};

const updateCalendarOnServer = async (newCalendar: any) => {
  try {
    const response = await fetch('http://localhost:3001/updateObject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCalendar),
    });

    const responseData = await response.json();
    console.log('Server response:', responseData);

    const responseDataString = JSON.stringify(responseData);
    localStorage.setItem('savedData', responseDataString);

  } catch (error) {
    console.error('Error updating calendar on server:', error);
  }
};



  return (
  <div className="calendarContainer">
    <div className="selectingMonthToDisplay_calendar">
      <div className="dropdown_calendar" ref={optionsMenu}>
        <button className="dropdown_calendar_button" onClick={toggleDropdown}>{selectedMonth}</button>
        {isOpen && (
          <ul className="options_calendar">
            {months.map((month) => (
              <li className="options_calendar_li" key={month} onClick={() => selectMonth(month)}>
                {month}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button onClick={sendHardcode}>update Calendar On Server</button>
      <div className="moodDayValueForMounth">
          <input
            className="year_calendar"
            type="number"
            value={year}
            onChange={handleChange}
            onKeyDown={(e) => e.key === "e" && e.preventDefault()}
            min="1900"
            max="2100"
          />
        </div>
      </div>
      <hr className="line" />
      <div className="moodCurrentMonth">{moodDayElements}</div>
    </div>
  )
}