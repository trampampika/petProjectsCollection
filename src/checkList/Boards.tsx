import { Board } from './Board';
import type { IBoard, ITask } from './types';
import './Boards.css';

export interface IProps {
  boards: IBoard[];
  editingId: number | null;
  onChange: (boardId: number, newValue: string, tasks: ITask[]) => void;
  onClick: (boardId: number) => void;
  onBlur: () => void;
}

export const Boards: React.FC<IProps> = (props) => {
  const { boards, editingId, onChange, onClick, onBlur } = props;

  const handleBoardChange = (newBoardName: string, tasks: ITask[], boardId: number) => {
    onChange(boardId, newBoardName, tasks);
  };
//доч компонент вставляет данные в от родителя в себя

  if (!Array.isArray(boards)) debugger; //DBG__

  const boardElements = boards.map(board => (
    <Board
      id={board.id}
      key={board.id}
      value={board.value}
      tasks={board.tasks}
      isEditing={board.id === editingId}
      onBlur={onBlur}
      onChange={handleBoardChange}
      onClick={onClick}
    />
  ));

// возвращает массив с разметкой
  return (
    <div className="boards">
      {boardElements}
    </div>
  );
};
//теперь бордс элемент выглядит как массив с заполненными данными отправленнми <Boards/> с свойствами и jsx разметка