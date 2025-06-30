import { FC, useState, useEffect, useRef } from "react";
import { awesome } from "../moodCalendar/emotionIcons";
import "./barChartStyles.css";
import {BarChart,  Bar,  ResponsiveContainer,  Cell,  XAxis,  YAxis} from "recharts";

type MoodDay = {
  id: string;
  dayOfTheMonth: number;
  isMoodChoosing: boolean;
  dayStyle: string;
};

type MonthData = {
  moodDays: MoodDay[];
  year: string;
  month: string;
};

const barColors = [
  "#ff6023",
  "#ffb700",
  "#dfdb3d",
  "#cacaca",
  "#83c27a",
  "#399eb6",
  "#5163ab",
];

const CustomTick = ({x, y, payload,}: {x: number; y: number; payload: any;}) => {
  const svgElement = awesome[payload.index];

  return (
    <g transform={`translate(${x - 15}, ${y}) scale(0.2)`}>{svgElement}</g>
  );
};



const months: string[] = [
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

export const BarChartContainer: FC = () => {
  const [year, setYear] = useState("");

  const [dataFromServer, setDataFromServer] = useState<MonthData[] | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    if (inputValue.length <= 4) {
      setYear(inputValue);
    }
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] =
    useState<string>("");

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  interface EmojiStat {
    name: string;
    amount: number | null;
  }



  const [selectedMonthEmojiStat, setSelectedMonthEmojiStat] = useState<EmojiStat[]>([]);

  const dataParser = () => {
    const localDataFromServer = dataFromServer;

    const dayStylesArray = localDataFromServer?.[0]?.moodDays?.map((day) => day.dayStyle);

    const countMap: { [key: string]: number } = {};

    dayStylesArray?.forEach(style => {
        if (countMap[style]) {
            countMap[style]++;
        } else {
            countMap[style] = 1;
        }
    });

    delete countMap.noEmoji;

    const emptyEmojiStats = [
      { name: "awesome", amount: null },
      { name: "good", amount: null },
      { name: "lilGood", amount: null },
      { name: "neutral", amount: null },
      { name: "lilBad", amount: null },
      { name: "bad", amount: null },
      { name: "awful", amount: null },
    ];

    const updatedEmojiStatsArray = emptyEmojiStats.map(item => {
      if (countMap[item.name] !== undefined) {
        return { ...item, amount: countMap[item.name] };
      }
      return item;
    });


    setSelectedMonthEmojiStat(updatedEmojiStatsArray);

  };

  const [lastDataFromServer, setlastDataFromServer] = useState(undefined);


useEffect(() => {

}, []);

useEffect(() => {
  dataParser();
}, [dataFromServer]);

  const selectMonth = (month: string) => {
    setSelectedMonth(month);
    setIsOpen(false);
  };



async function getFilteredObject(year: string, month: string) {
  try {
    const response = await fetch(
      `http://localhost:3001/api/objects?year=${encodeURIComponent(year)}&month=${encodeURIComponent(month)}`
    );
    if (!response.ok) {
      throw new Error(`Ошибка при получении данных: ${response.status}`);
    }
    const jsonData = await response.json();
    setDataFromServer(jsonData);
    console.log(jsonData, "jsonData");

    localStorage.setItem("year", jsonData[0].year);
    localStorage.setItem("month", jsonData[0].month);

  } catch (error) {
    console.error('Произошла ошибка:', error);
  }
}


useEffect(() => {
  getFilteredObject(year, selectedMonth);
}, [selectedMonth, year]);



useEffect(() => {
  const dataFromLocalStorage = localStorage.getItem('lastViewedFilledStat');
  if (dataFromLocalStorage) {
    const parsedData = JSON.parse(dataFromLocalStorage);
    setSelectedMonthEmojiStat(parsedData);
  }
  const savedYear = localStorage.getItem("year");
  const savedMonth = localStorage.getItem("month");

  if (savedYear && savedMonth) {
   setYear(savedYear);
   setSelectedMonth(savedMonth);
  } else {
    console.log("Данные не найдены в localStorage");
  }
}, []);


useEffect(() => {
  if (dataFromServer) {
    const hasNonNullAmount = selectedMonthEmojiStat.some(item => item.amount !== null);

    if (hasNonNullAmount) {
      setShowErrorMessage(false);
      localStorage.setItem('lastViewedFilledStat', JSON.stringify(selectedMonthEmojiStat));
    } else {
      setShowErrorMessage(true);
    }
  }
}, [selectedMonthEmojiStat, dataFromServer]);



const optionsMenu = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  const handleClick = (event: MouseEvent) => {
    if (isOpen && !optionsMenu.current?.contains(event.target as Node | null)) {
      console.log('Clicked!', event);
      setIsOpen(false);
    }
  };

  document.addEventListener('click', handleClick);

  return () => {
    document.removeEventListener('click', handleClick);
  };
}, [isOpen]);

const [showErrorMessage, setShowErrorMessage] = useState(false);

return (
  <><div className="barChartContainer">
    <div className="moodDayValueForMounth">
      <h2
        style={{
          textAlign: "left",
          fontSize: "20px",
          fontWeight: "normal",
        }}
      >
        Количество дней настроения за:
      </h2>
      <div className="selectingMonthToDisplay">
        <div className="dropdown" ref={optionsMenu}>
          <button onClick={toggleDropdown}>{selectedMonth}</button>
          {isOpen && (
            <ul className="options">
              {months.map((month) => (
                <li key={month} onClick={() => selectMonth(month)}>
                  {month}
                </li>
              ))}
            </ul>
          )}
        </div>
        <input
          className="year"
          type="number"
          value={year}
          onChange={handleChange}
          onKeyDown={(e) => e.key === "e" && e.preventDefault()}
          min="1900"
          max="2100"
        />
      </div>
    </div>
    <div className="errorContainer">
      <div style={{ display: showErrorMessage ? "block" : "none", color:"red" }}>
        Отсутствует статистика за этот период
      </div>
    </div>
      <ResponsiveContainer width="100%" height="110%">
        <BarChart data={selectedMonthEmojiStat} barCategoryGap={27}>
          <XAxis dataKey="name" tick={CustomTick} tickMargin={0} />
          <YAxis />
          <Bar
            dataKey="amount"
            isAnimationActive={false}
            label={{ position: "insideTop", style: { fill: "black" } }}
          >
            {selectedMonthEmojiStat.map((entry, index) => (
              <Cell
                width={30}
                key={`cell-${index}`}
                fill={barColors[index % 7]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </>
);
}
