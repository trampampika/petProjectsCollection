import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Task } from './Task';
import { ITask } from './types';
import './Board.css';

export interface IProps {
  id: number;
  value: string;
  tasks: ITask[];
  isEditingTitle: boolean;
  onBlur: () => void;
  onChange: (
    newBoardName: string,
    tasks: ITask[],
    boardId: number,
  ) => void;
  onSelectEditingTitle: (boardId: number) => void;
  initTasks?: any[];
}

export const Board: React.FC<IProps> = (props) => {
  const { id, value, tasks, isEditingTitle, onBlur, onChange, onSelectEditingTitle } = props;

  // TODO: const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  // TODO: wrong working?
  const [nextTaskID, setNextTaskID] = useState(
    tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1
  );

  const titleInputRef = useRef<HTMLInputElement>(null);

  // auto focus appearing title input
  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
    }
  }, [isEditingTitle]);

  const onTaskChange = (newTask: ITask) => {
    const tasksWithoutChanged = tasks.filter(t => t.id !== newTask.id);
    const newTasks = [...tasksWithoutChanged, newTask];
    onChange(value, newTasks, id);
  };

  const handleAddTask = () => {
    if (!nextTaskID) throw Error('Init next Task ID error');

    const newTask = { id: nextTaskID, title: '' };
    const newTasks = [...tasks, newTask];
    onChange(value, newTasks, id);
    setNextTaskID(nextTaskID + 1);
  }

  const taskElements = tasks.map(task => (
    <Task
      key={task.id}
      id={task.id}
      value={task.title}
      onChange={onTaskChange}
    />
  ));

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.currentTarget.value, tasks, id);
  };

  return (
    <div className="board">
      {isEditingTitle ? (
        <input
          ref={titleInputRef}
          value={value}
          onChange={handleTitleChange}
          onBlur={onBlur}
        />
      ) : (
        <div
          onClick={() => onSelectEditingTitle(id)}
          className="board"
        >
          {value}
        </div>
      )}
      <div className="taskList">
        <button onClick={handleAddTask}>Add task</button>
      </div>
      {taskElements}
    </div>
  );
};
