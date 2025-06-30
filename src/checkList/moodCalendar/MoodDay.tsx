import { type FC } from "react";
import "./MoodCalendarStyles.css";
import { MoodChoice } from "./MoodChoice";

interface IProps {
  dayId: string;
  dayOfTheMonth: number;
  isMoodChoosing: boolean;
  dayStyle: string;
  onStartChoosing: (dayId: string) => void;
  onFinishChoosing: (dayId: string, dayStyle: string) => void;
  onHandleClickOutside: () => void;
}

export const MoodDay: FC<IProps> = ({
  dayOfTheMonth,
  dayStyle,
  isMoodChoosing,
  onHandleClickOutside,
  onStartChoosing,
  onFinishChoosing,
  dayId,
}) => {


  return (
    <div>
      {isMoodChoosing && (
        <MoodChoice
          dayId={dayId}
          onFinishChoosing={onFinishChoosing}
          onHandleClickOutside={onHandleClickOutside}
        />
      )}
      <div className={dayStyle} onClick={() => onStartChoosing(dayId)}>
        <div className="moodDayNumber"></div>
        <div className="dayOfTheMonth">{dayOfTheMonth}</div>
      </div>
    </div>
  );
};
