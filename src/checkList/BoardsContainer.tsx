import { useEffect, useState } from "react";
import { Boards } from './Boards';
import { IBoard, ITask } from './types';
import { isBoard } from './typeGuards';

import './BoardsContainer.css';

const INITIAL_BOARD_ID = 0;
const INITIAL_STATE: IBoard[] = [];


const BOARDS_LOCALSTORAGE_KEY = 'boards';
const readData = () => localStorage.getItem(BOARDS_LOCALSTORAGE_KEY);
const parseData = (readData: string) => {
  try {
    const parsed = JSON.parse(readData);
    if (
      Array.isArray(parsed) &&
      parsed.every(potentialBoard => isBoard(potentialBoard))
    ) {
      return parsed;
    }
  } catch (err) {
    // TODO: log parsing error to user
    console.error(err);
  }
};


export const BoardsContainer: React.FC = () => {
  const [prevSerializedState, setPrevSerializedState] = useState<string | undefined>();
  const [hasChanges, setHasChanges] = useState(false);

  const [boards, setBoards] = useState<IBoard[]>();
  const [nextBoardID, setNextBoardID] = useState<number | null>(null);

  const handleBoardsSave = () => {
    const newSerializedState = JSON.stringify(boards);
    localStorage.setItem(BOARDS_LOCALSTORAGE_KEY, newSerializedState);
    setPrevSerializedState(newSerializedState);
    setHasChanges(false);
  };

  // init data read (with determine next board id)
  useEffect(() => {
    if (!!boards?.length || nextBoardID !== null) return;

    const savedData = readData() || JSON.stringify(INITIAL_STATE);
    const savedBoards = parseData(savedData) || INITIAL_STATE;
    setPrevSerializedState(savedData);
    setBoards(savedBoards);

    const sortedIds = savedBoards.map(b => b.id).sort((a, b) => b - a);
    const maxId = sortedIds[0] || INITIAL_BOARD_ID;
    const nextId = maxId + 1;
    setNextBoardID(nextId);
  }, [boards, nextBoardID]);

  // checks boards changes
  useEffect(() => {
    if (!prevSerializedState) return;

    const newSerializedState = JSON.stringify(boards);
    if (newSerializedState !== prevSerializedState) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [boards, prevSerializedState]);

  const handleAddBoard = () => {
    if (!boards) throw Error('no boards when add new board'); // formal
    if (!nextBoardID) throw Error('Init next board ID error');

    const newBoard = { id: nextBoardID, value: 'Новая доска', tasks: [] };
    setBoards([...boards, newBoard]);
    setNextBoardID(nextBoardID + 1);
  }

  const handleBoardChange = (boardId: number, newValue: string, newTasks: ITask[]) => {
    if (!boards) throw Error('no boards when change board'); // formal

    const newBoards = structuredClone(boards);
    const changedBoard = newBoards.find(board => board.id === boardId);
    if (!changedBoard) throw new Error(`Cannot find board with board id: ${boardId}`);

    changedBoard.value = newValue;
    changedBoard.tasks = newTasks;
    setBoards(newBoards);
  };

  const handleBoardRemove = (id: number) => {
    if (boards) { // formal
      const replaceIdx = boards.findIndex(t => t.id === id);
      const copiedBoards =  boards.slice();
      copiedBoards.splice(replaceIdx, 1);
      setBoards(copiedBoards);
    }
  };

  const isSaveButtonDisabled = !hasChanges;

  if (!boards) return null;

   return (
    <div className="boardContainer">
      <Boards
        boards={boards}
        onChange={handleBoardChange}
        onBoardRemove={handleBoardRemove}
      />
      <div>
        <button
          disabled={isSaveButtonDisabled}
          className="addBoardButton"
          onClick={handleBoardsSave}
        >
          Save Boards
        </button>
        <button
          className="addBoardButton"
          onClick={handleAddBoard}
        >
          +
        </button>
      </div>
    </div>
  );
}
