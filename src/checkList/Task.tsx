import { ChangeEvent } from 'react';
import { ITask } from './types';

////should import ./Task.css
import './Board.css';

import './Task.css';

export interface IProps {
  onChange: (task: ITask) => void;
  id: number;
  title: string;
  boardId: number;
  isDone: boolean;
  onTaskRemove:(id: number, boardId: number) => void;
}

export const Task: React.FC<IProps> = (props) => {
  const { onChange, id, title, isDone, onTaskRemove, boardId } = props;

  const onTitleChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    onChange({ id, title: e.currentTarget.value, isDone });

  const handleRemoveClick = () =>
    onTaskRemove(id, boardId);

  const handleIsTaskDone = () =>
    onChange({ id, title, isDone: !isDone });

  const taskClassName = isDone ? 'task task_done' : 'task';

  return (
    <div id={id.toString()}>
      <div className="taskLine">
        <button className="crossRemovingTask" onClick={handleRemoveClick}>X</button>
          <textarea className={taskClassName} value={title} onChange={onTitleChange} />
          <div className="checkBoxContainer">
          <input
            type="checkbox"
            checked={isDone}
            onChange={handleIsTaskDone}
          />
          </div>
      </div>
    </div>
  );
};