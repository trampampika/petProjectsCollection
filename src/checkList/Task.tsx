import { ChangeEvent } from 'react';
import { ITask } from './types';

export interface IProps {
  onChange: (task: ITask) => void;
  id: number;
  title: string;
  boardId: number;
  onTaskRemove:(id: number, boardId: number) => void;
}

export const Task: React.FC<IProps> = (props) => {
  const { onChange, id, title, onTaskRemove, boardId } = props;

  const onTitleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ id, title: e.currentTarget.value });
  };

  const handleRemoveClick = () => {
    onTaskRemove(id, boardId);
  };

  return (
    <div id={id.toString()}>
      <textarea
        value={title}
        onChange={onTitleChange}>
      </textarea>
      <div>
        <button>done</button>
        <button onClick={handleRemoveClick}>remove</button>
      </div>
    </div>
  );
};
