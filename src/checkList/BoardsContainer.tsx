import { useEffect, useState } from "react";
import { Boards } from './Boards';
import { IBoard, ITask } from './types';

import './BoardsContainer.css';

const INITIAL_BOARD_ID = 0;
const INITIAL_STATE: IBoard[] = [];

////extract
const BOARDS_LOCALSTORAGE_KEY = 'boards';
const readData = () => localStorage.getItem(BOARDS_LOCALSTORAGE_KEY);
const parseData = (readData: string) => {
  try {
    const parsed = JSON.parse(readData);
    return parsed;
  } catch (err) {
    // TODO: log parsing error to user
    console.error(err);
  }
};

export interface IProps {
  initBoards?: IBoard[];
}

export const BoardsContainer: React.FC<IProps> = (props) => {
  const initBoards = props.initBoards || INITIAL_STATE;

  const [prevSerializedState, setPrevSerializedState] = useState<string | undefined>();
  const [hasChanges, setHasChanges] = useState(false);

  const [boards, setBoards] = useState(initBoards);
  const [nextBoardID, setNextBoardID] = useState<number | null>(null);

  const [editingBoardId, setEditingBoardId] = useState<number | null>(null);

  const saveBoards = (boards: IBoard[]) => {
    const boardsStr = JSON.stringify(boards);
    localStorage.setItem(BOARDS_LOCALSTORAGE_KEY, boardsStr);
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
    const savedData = readData() || JSON.stringify(INITIAL_STATE);
    const prevState = parseData(savedData) || INITIAL_STATE;
    setPrevSerializedState(savedData);
    setBoards(prevState);
  }, []);

  useEffect(() => {
    ////compare & setHasChanges(true)
  }, [boards]);

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

  const isSaveButtonDisabled = !hasChanges;

  return (
    <div className="boardContainer">
      <button disabled={isSaveButtonDisabled} className="addBoardButton" onClick={() => saveBoards(boards)}>
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

