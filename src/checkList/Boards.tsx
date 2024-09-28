import { Board } from './Board';
import type { IBoard, ITask } from './types';
import './Boards.css';

export interface IProps {
  boards: IBoard[];
  onChange: (boardId: number, newValue: string, tasks: ITask[]) => void;
  onBoardRemove: (id: number) => void;
}

export const Boards: React.FC<IProps> = (props) => {
  const { boards, onChange, onBoardRemove } = props;

  const handleBoardChange = (newBoardName: string, tasks: ITask[], boardId: number) => {
    onChange(boardId, newBoardName, tasks);
  };

  const boardElements = boards.map(board => (
    <Board
      id={board.id}
      key={board.id}
      value={board.value}
      tasks={board.tasks}
      onChange={handleBoardChange}
      onBoardRemove={onBoardRemove}
    />
  ));

  return (
    <div className="boards">
      {boardElements}
    </div>
  );
};
