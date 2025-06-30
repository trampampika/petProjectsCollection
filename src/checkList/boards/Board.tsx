import { ChangeEvent, useState, useEffect, useRef, useLayoutEffect } from "react";
import { Task } from "./Task";
import { ITask } from "./types";
import "./Board.css";

export interface IProps {
  id: string;
  value: string;
  tasks: ITask[];
  onChange: (newBoardName: string, tasks: ITask[], boardId: string) => void;
  initTasks?: any[];
  onBoardRemove: (id: string) => void;
}

export const Board: React.FC<IProps> = (props) => {
  const { id, value, tasks, onChange, onBoardRemove } = props;

  const [nextTaskID, setNextTaskID] = useState(
    crypto.randomUUID(),
  );

  const handleTaskChange = (newTask: ITask) => {
    const indexReplaceToNewTask = tasks.findIndex((t) => t.id === newTask.id);
    const copiedTasks = tasks.slice();
    copiedTasks[indexReplaceToNewTask] = newTask;
    onChange(value, copiedTasks, id);
  };

  const handleAddTask = () => {
    if (!nextTaskID) throw Error("Init next Task ID error");

    const newTask = { id: nextTaskID, title: "", isDone: false };
    const newTasks = [...tasks, newTask];
    onChange(value, newTasks, id);
    setNextTaskID(crypto.randomUUID());
  };

  const handleTaskRemove = (taskId: string, boardId: string) => {
    const indexReplaceToNewTask = tasks.findIndex((t) => t.id === taskId);
    const copiedTasks = tasks.slice();
    copiedTasks.splice(indexReplaceToNewTask, 1);
    onChange(value, copiedTasks, boardId);
  };

  const [filledProgressValue, setFilledProgressValue] = useState(0);
  const progressStyle = { width: filledProgressValue + "%" };

  useEffect(() => {
    if (!tasks.length) {
      setFilledProgressValue(0);
      return;
    }

    const doneTasks = tasks.filter((task) => task.isDone);
    const percentOfFilling = Math.round(
      (1 / (tasks.length / doneTasks.length)) * 100,
    );
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
    autosizeTextareaHeight();
  };

  const handleBoardRemove = () => {
    onBoardRemove(id);
  };
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditMode = () => {
    if (!isEditing) {
      setIsEditing(true);
      inputRef.current?.focus(); // Фокусируемся на textarea после включения режима редактирования
    } else {
      setIsEditing(false);
    }
  };


  const boardTopTextAreaRef = useRef<HTMLTextAreaElement>(null);

    const autosizeTextareaHeight = () => {
      if (!boardTopTextAreaRef.current) return;

      boardTopTextAreaRef.current.style.height = 'inherit';
      boardTopTextAreaRef.current.style.height = `${boardTopTextAreaRef.current.scrollHeight}px`;
    };

    useLayoutEffect(() => {
      autosizeTextareaHeight();
    }, []);

  return (
    <div className="board">
      <div className="boardTop" onClick={toggleEditMode}>
        {isEditing ? (
          <textarea
            ref={boardTopTextAreaRef}
            className="boardName-editable"
            value={value}
            onChange={handleTitleChange}
            onBlur={toggleEditMode}
          />
        ) : (
          <textarea
            className="boardName-readonly"
            value={value}
            readOnly
          />
        )}
      </div>
      <div className="taskList">{taskElements}</div>
      <div className="boardBottom">
        <div className="progressBar" style={progressStyle}></div>
        <div className="controls">
          <button className="addTask" onClick={handleAddTask}>
            Add task
          </button>
          <button className="removeBoard" onClick={handleBoardRemove}>
            Remove board
          </button>
        </div>
      </div>
    </div>
  );
}
