import { FC } from "react";

interface IProps {
  style: string;
  id: string;
  OnFinishChoosing: (dayId: string, dayStyle: string) => void;
}

export const Emoji: FC<IProps> = ({ id, style, OnFinishChoosing }) => {

  const HandleClickFinishChosing = () => {
    OnFinishChoosing(id, style);
  };

  return <div id={id} className={style} onClick={HandleClickFinishChosing}></div>;
};
