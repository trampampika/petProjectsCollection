import { useState } from 'react';
import { ITask } from './types';

export interface IProps {
  ////add props descr
}

const INITIAL_TASK_TEXT = 'New task...';

export const TasksContainer: React.FC<IProps> = (props) => {
  const [tasks, setTasks] = useState<ITask[]>([]);

  const handleAddTaskClick = () => {
    // TODO: make same ID system like in Boards
    // setTasks([...tasks, { id: XXX, text: INITIAL_TASK_TEXT }]);
    setTasks([...tasks, { text: INITIAL_TASK_TEXT }]);
  };

  const taskElements = tasks.map(task => (
    <li>
      <input
        value="Пример текста"
        onChange={(value) => console.log(value)}
        placeholder="Введите текст..."
      />
    </li>
  ));

  return (
    <div>
      <button className="Button" onClick={handleAddTaskClick}>Add task</button>
      <ul>
        {taskElements}
      </ul>
    </div>
  );
};
