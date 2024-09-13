import { ChangeEvent } from 'react';
import { ITask } from './types';

export interface IProps {
  onChange: (task: ITask) => void;
  id: number;
  value: string;
  // isEditing: boolean; ////add
}

export const Task: React.FC<IProps> = (props) => {
  const { onChange, id, value } = props;

  const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ id, title: e.currentTarget.value });
  };

  return (
    <div>
      <input value={value} onChange={onTitleChange}></input>
    </div>
  );
};
