import { useEffect, useState } from "react";
import { Boards } from './Boards';
import { IBoard } from './types';

import './BoardsContainer.css';

const INITIAL_BOARD_ID = 0;

//храним счетчик борд айди со значением ноль

export interface IProps {
  initBoards?: IBoard[];
}

export const BoardsContainer: React.FC<IProps> = (props) => {
  const initBoards = props.initBoards || [];

/*BoardsContainer с полученными пропсами хранит initBoards когда получает
initBoards свойства объекта props или пустой массив, если значение props.initBoards
отсутствует
*/

  const [boards, setBoards] = useState(initBoards);
  //объявляем состояние начинающиеся с initBoards
  const [nextBoardID, setNextBoardID] = useState<number | null>(null);
/* 1 объявляем состояниеВ данном случае, переменная nextBoardID может содержать либо число, либо null.
*/
  const [editingBoardId, setEditingBoardId] = useState<number | null>(null);
/* 2объявляем состояниеВ данном случае, переменная nextBoardID может содержать либо число, либо null.
*/
  // determine next board id
  useEffect(() => {
    const sortedIds = boards.map(b => b.id).sort((a, b) => b - a);
    const maxId = sortedIds[0] || INITIAL_BOARD_ID;
    const nextId = maxId + 1;
    setNextBoardID(nextId);
  }, []);

  const handleAddBoard = () => {
    if (!nextBoardID) throw Error('Init next board ID error');

    const newBoard = { id: nextBoardID, value: 'Новая доска' };
    setBoards([...boards, newBoard]);
    setNextBoardID(nextBoardID + 1);
  }

  const handleBoardChange = (boardId: number, newValue: string) => {
    const newBoards = structuredClone(boards);
    const changedBoard = newBoards.find(board => board.id === boardId);

    if (!changedBoard) throw new Error(`Cannot find board with board id: ${boardId}`);
/*вернись сюда
const changedBoard: Board | undefined = newBoards.find(board => board.id === boardId);
*/
    changedBoard.value = newValue;
    setBoards(newBoards);
  };

  const handleBoardsClick = (boardId: number) => {
    setEditingBoardId(boardId);
  };

  const handleBoardsBlur = () => {
    setEditingBoardId(null);
  };

  return (
    <div className="boardContainer">
      <button className="addBoardButton" onClick={handleAddBoard}>
        +
      </button>
      <Boards
        boards={boards}
        editingId={editingBoardId}
        onBoardChange={handleBoardChange}
        onBoardClick={handleBoardsClick}
        onBoardBlur={handleBoardsBlur}
      />
    </div>
  );
}



