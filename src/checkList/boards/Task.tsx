import { type ChangeEvent, useLayoutEffect, useRef } from 'react';
import type { ITask } from './types';
import './Board.css';
import './Task.css';

export interface IProps {
  onChange: (task: ITask) => void;
  id: string;
  title: string;
  boardId: string;
  isDone: boolean;
  onTaskRemove:(id: string, boardId: string) => void;
}

export const Task: React.FC<IProps> = (props) => {
  const { onChange, id, title, isDone, onTaskRemove, boardId } = props;

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autosizeTextareaHeight = () => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = 'inherit';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  useLayoutEffect(() => {
    autosizeTextareaHeight();
  }, []);

  const onTitleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ id, title: e.currentTarget.value, isDone });
    autosizeTextareaHeight();
  };

  const handleRemoveClick = () =>
    onTaskRemove(id, boardId);

  const handleIsTaskDone = () => {
    onChange({ id, title, isDone: !isDone })
  };

  const taskClassName = isDone ? 'task task_done' : 'task';

  return (
    <div id={id.toString()}>
      <div className="taskLine">
        <button className="crossRemovingTask" onClick={handleRemoveClick}>X</button>
          <textarea
            ref={textareaRef}
            className={taskClassName}
            readOnly={isDone}
            value={title}
            onChange={onTitleChange}
          />
          <div className={`checkBoxContainer ${isDone ? 'is-done' : ''}`}>
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