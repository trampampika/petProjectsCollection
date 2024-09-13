import { Board } from './Board';
import type { IBoard, ITask } from './types';
import './Boards.css';

export interface IProps {
  boards: IBoard[];
  editingTitleId: number | null;
  onChange: (boardId: number, newValue: string, tasks: ITask[]) => void;
  onSelectEditingTitle: (boardId: number) => void;
  onBlur: () => void;
}

export const Boards: React.FC<IProps> = (props) => {
  const { boards, editingTitleId, onChange, onSelectEditingTitle, onBlur } = props;

  const handleBoardChange = (newBoardName: string, tasks: ITask[], boardId: number) => {
    onChange(boardId, newBoardName, tasks);
  };

  const boardElements = boards.map(board => (
    <Board
      id={board.id}
      key={board.id}
      value={board.value}
      tasks={board.tasks}
      isEditingTitle={board.id === editingTitleId}
      onBlur={onBlur}
      onChange={handleBoardChange}
      onSelectEditingTitle={onSelectEditingTitle}
    />
  ));

  return (
    <div className="boards">
      {boardElements}
    </div>
  );
};
