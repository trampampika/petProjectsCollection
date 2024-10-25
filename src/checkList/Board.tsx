import { ChangeEvent, useState, useEffect } from 'react';
import { Task } from './Task';
import { ITask } from './types';
import './Board.css';

export interface IProps {
  id: number;
  value: string;
  tasks: ITask[];
  onChange: (newBoardName: string, tasks: ITask[], boardId: number) => void;
  initTasks?: any[];
  onBoardRemove: (id: number) => void;
}

export const Board: React.FC<IProps> = (props) => {
  const { id, value, tasks, onChange, onBoardRemove } = props;

  // TODO: wrong working?
  const [nextTaskID, setNextTaskID] = useState(
    tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
  );

  const handleTaskChange = (newTask: ITask) => {
    const indexReplaceToNewTask = tasks.findIndex((t) => t.id === newTask.id);
    const copiedTasks = tasks.slice();
    copiedTasks[indexReplaceToNewTask] = newTask;
    onChange(value, copiedTasks, id);
  };

  const handleAddTask = () => {
    if (!nextTaskID) throw Error('Init next Task ID error');

    const newTask = { id: nextTaskID, title: '', isDone: false };
    const newTasks = [...tasks, newTask];
    onChange(value, newTasks, id);
    setNextTaskID(nextTaskID + 1);
  };

  const handleTaskRemove = (id: number, boardId: number) => {
    const indexReplaceToNewTask = tasks.findIndex((t) => t.id === id);
    const copiedTasks = tasks.slice();
    copiedTasks.splice(indexReplaceToNewTask, 1);
    onChange(value, copiedTasks, (id = boardId));
  };

  const [filledProgressValue, setFilledProgressValue] = useState(0);
  const progressStyle = { width: filledProgressValue + '%' };

  useEffect(() => {
    if (!tasks.length) {
      setFilledProgressValue(0);
      return;
    }

    const doneTasks = tasks.filter((task) => task.isDone);
    const percentOfFilling = Math.round((1 / (tasks.length / doneTasks.length)) * 100);
    setFilledProgressValue(percentOfFilling);
  }, [tasks]);

  const taskElements = tasks.map((task) => (
    <Task
      boardId={id}
      key={task.id}
      id={task.id}
      title={task.title}
      isDone={task.isDone}
      onChange={handleTaskChange}
      onTaskRemove={handleTaskRemove}
    />
  ));

  const handleTitleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.currentTarget.value, tasks, id);
  };

  const handleBoardRemove = () => {
    onBoardRemove(id);
  };

  return (
    <div className="board">
      <div className="boardTop">
        <textarea
          className="boardName"
          value={value}
          onChange={handleTitleChange}
        />
      </div>
      <div className="taskList">{taskElements}</div>
      <div className="progressBar" style={progressStyle}></div>
      <div className="controls">
        <button onClick={handleAddTask}>Add task</button>
        <button onClick={handleBoardRemove}>Remove board</button>
      </div>
    </div>
  );
};
