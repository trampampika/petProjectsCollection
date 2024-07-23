import { Board } from './Board';

import './Boards.css';
import { IBoard } from './types';

export interface IProps {
  boards: IBoard[];
  editingId: number | null;
  onBoardChange: (boardId: number, newValue: string) => void;
  onBoardClick: (boardId: number) => void;
  onBoardBlur: () => void;
}

export const Boards: React.FC<IProps> = (props) => {
  const { boards, editingId, onBoardChange, onBoardClick, onBoardBlur } = props;

  const handleBoardChange = (event: React.ChangeEvent<HTMLInputElement>, boardId: number) => {
    onBoardChange(boardId, event.target.value);
  };

  const boardElements = boards.map(board => (
    <Board
      id={board.id}
      key={board.id}
      value={board.value}
      isEditing={board.id === editingId}
      onBlur={onBoardBlur}
      onChange={handleBoardChange}
      onClick={onBoardClick}
    />
  ));

  return (
    <div className="boards">
      {boardElements}
    </div>
  );
};
