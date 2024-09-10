import { ChangeEvent, useState } from 'react';
import "./Board.css";
import { Task } from './Task';
import { ITask } from './types';

export interface IProps {
  id: number;
  value: string;
  tasks: ITask[];
  isEditing: boolean;
  onBlur: () => void;
  onChange: (
    newBoardName: string,
    tasks: ITask[],
    boardId: number,
  ) => void;
  onClick: (boardId: number) => void;
  initTasks?: any[];
}

export const Board: React.FC<IProps> = (props) => {
  const { id, value, tasks, isEditing, onBlur, onChange, onClick } = props;

  ////?? const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  ////? wrong working
  const [nextTaskID, setNextTaskID] = useState(
    tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1
  );

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


  const handleBoardChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.currentTarget.value, tasks, id);
  };

  return (
    <div className="board" onClick={() => onClick(id)}>
      {isEditing ? (
        <input
          value={value}
          onChange={handleBoardChange}
          onBlur={onBlur}
        />
      ) : (
        <div className="board">{value}</div>
      )}
      <div className="taskList">
        <button onClick={handleAddTask}>Add task</button>
      </div>
      {taskElements}
    </div>
  );
};
