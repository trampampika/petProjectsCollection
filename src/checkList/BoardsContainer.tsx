import { useEffect, useState } from "react";
import { Boards } from './Boards';
import { IBoard, ITask } from './types';

import './BoardsContainer.css';

const INITIAL_BOARD_ID = 0;
const INITIAL_STATE: IBoard[] = [];

// TODO: extract to another files
const isTask = (pTask: unknown): pTask is ITask => {
  if (
    pTask !== null &&
    typeof pTask === 'object' &&

    'id' in pTask &&
    Number.isInteger(pTask.id) &&

    'title' in pTask &&
    typeof pTask.title === 'string'
  ) {
    return true;
  }

  return false;
};
const isBoard = (pBoard: unknown): pBoard is IBoard => {
  if (
    pBoard !== null &&
    typeof pBoard === 'object' &&

    'id' in pBoard &&
    Number.isInteger(pBoard.id)&&

    'value' in pBoard &&
    typeof pBoard.value === 'string' &&

    'tasks' in pBoard &&
    Array.isArray(pBoard.tasks) &&
    pBoard.tasks.every(potentialTask => isTask(potentialTask))
  ) {
    return true;
  }

  return false;
}
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

  const [editingBoardTitleId, setEditingBoardTitleId] = useState<number | null>(null);

  const saveBoards = () => {
    const newSerializedState = JSON.stringify(boards);
    localStorage.setItem(BOARDS_LOCALSTORAGE_KEY, newSerializedState);
    setPrevSerializedState(newSerializedState);
    setHasChanges(false);
  };

  // init data read (with determine next board id)
  useEffect(() => {
    if (!!boards?.length || nextBoardID !== null) return;

    console.log('DBG__ init data read');
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

  const handleSelectEditingTitleId = (boardId: number) => {
    setEditingBoardTitleId(boardId);
  };

  const handleBoardTitleBlur = () => {
    setEditingBoardTitleId(null);
  };

  const isSaveButtonDisabled = !hasChanges;

  if (!boards) return null;

  return (
    <div className="boardContainer">
      <button disabled={isSaveButtonDisabled} className="addBoardButton" onClick={saveBoards}>
        SAVE BOARDS
      </button>
      <button className="addBoardButton" onClick={handleAddBoard}>
        +
      </button>
      <Boards
        boards={boards}
        editingTitleId={editingBoardTitleId}
        onChange={handleBoardChange}
        onSelectEditingTitle={handleSelectEditingTitleId}
        onBlur={handleBoardTitleBlur}
        // TODO: add "onTaskFocused" callback to erase board editing id
      />
    </div>
  );
}
