import { useEffect, useState } from "react";
import { Boards } from './Boards';
import { IBoard, ITask } from './types';

import './BoardsContainer.css';

const INITIAL_BOARD_ID = 0;

//храним счетчик борд айди со значением ноль

export interface IProps {
  initBoards?: IBoard[];
}

export const BoardsContainer: React.FC<IProps> = (props) => {
  const initBoards = props.initBoards || [];

  const [boards, setBoards] = useState(initBoards);
  const [nextBoardID, setNextBoardID] = useState<number | null>(null);

  const [editingBoardId, setEditingBoardId] = useState<number | null>(null);

  ////extract
  const BOARDS_LOCALSTORAGE_KEY = 'boards';
  const saveBoards = (boards: IBoard[]) => {
    const boardsStr = JSON.stringify(boards);
    localStorage.setItem(BOARDS_LOCALSTORAGE_KEY, boardsStr);
  };
  const readData = () => {
    const data = localStorage.getItem(BOARDS_LOCALSTORAGE_KEY);
    if (!data) return [];
    try {
      const parsed = JSON.parse(data);
      return parsed;
    } catch (err) {
      ////log parsing error
      return {};
    }
  };

  // determine next board id
  useEffect(() => {
    const sortedIds = boards.map(b => b.id).sort((a, b) => b - a);
    const maxId = sortedIds[0] || INITIAL_BOARD_ID;
    const nextId = maxId + 1;
    setNextBoardID(nextId);
  }, []);

  // init data read
  useEffect(() => {
    const extractedData = readData();
    setBoards(extractedData);
  }, []);

  const handleAddBoard = () => {
    if (!nextBoardID) throw Error('Init next board ID error');

    const newBoard = { id: nextBoardID, value: 'Новая доска', tasks: [] };
    setBoards([...boards, newBoard]);
    setNextBoardID(nextBoardID + 1);
  }

  //хэндл борд меняет данные
  const handleBoardChange = (boardId: number, newValue: string, newTasks: ITask[]) => {
    const newBoards = structuredClone(boards);
    const changedBoard = newBoards.find(board => board.id === boardId);
    if (!changedBoard) throw new Error(`Cannot find board with board id: ${boardId}`);

    changedBoard.value = newValue;
    changedBoard.tasks = newTasks;
    setBoards(newBoards);
  };

  const handleBoardsClick = (boardId: number) => {
    setEditingBoardId(boardId);
  };

  const handleBoardsBlur = () => {
    setEditingBoardId(null);
  };

  const onTaskChange = () => {
    console.log('DBG__ ');
  };

  return (
    <div className="boardContainer">
      <button className="addBoardButton" onClick={() => saveBoards(boards)}>
        SAVE BOARDS
      </button>
      <button className="addBoardButton" onClick={handleAddBoard}>
        +
      </button>
      <Boards
        boards={boards}
        editingId={editingBoardId}
        onChange={handleBoardChange}
        onClick={handleBoardsClick}
        onBlur={handleBoardsBlur}
      />
    </div>
  );
}

// пропсы данные отправляют в компонент

