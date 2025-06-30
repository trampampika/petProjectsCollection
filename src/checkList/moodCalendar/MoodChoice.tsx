import { FC, useEffect, useState, useRef } from "react";
import "./MoodCalendarStyles.css";
import { Emoji } from "./Emoji";

interface IProps {
  dayId: string;
  onFinishChoosing: (dayId: string, dayStyle: string) => void;
  onHandleClickOutside: () => void;
}

export const MoodChoice: FC<IProps> = ({ dayId, onFinishChoosing, onHandleClickOutside }) => {
  const emotionNames = [
    "awful",
    "bad",
    "lilBad",
    "neutral",
    "lilGood",
    "good",
    "awesome",
    "noEmoji"
  ];

  const [emojisForChoosing, setEmojisForChoosing] = useState<{ style: string; dayId: string }[]>([]);
  const moodChoiceRef = useRef<HTMLDivElement>(null);

  const fillOutEmojis = () => {
    const emojisCopy = emotionNames.map((style) => ({ style, dayId }));
    console.log('emojisCopy:', emojisCopy);
    setEmojisForChoosing(emojisCopy);
  };

  useEffect(() => {
    fillOutEmojis();

    const handleClickOutside = (event: MouseEvent) => {
      if (moodChoiceRef.current && !moodChoiceRef.current.contains(event.target as Node)) {
        onHandleClickOutside();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const emojisElements = emojisForChoosing.map((emoji) => (
    <Emoji
    key={`${emoji.dayId}-${emoji.style}`}
    id={emoji.dayId}
    style={emoji.style}
    OnFinishChoosing={onFinishChoosing}
  />
  ));


  return <div ref={moodChoiceRef} className="moodChoice">{emojisElements}</div>;
};


