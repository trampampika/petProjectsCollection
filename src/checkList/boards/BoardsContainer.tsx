import { FC } from "react";
import { useEffect, useState } from "react";
import { Boards } from "./Boards";
import { IBoard, ITask } from "./types";
import { isBoard } from "../typeGuards";
import './BoardsContainer.css';
import toast from 'react-hot-toast';



export const BoardsContainer: FC = () => {
  const [boards, setBoards] = useState<IBoard[]>();
  const [nextBoardID, setNextBoardID] = useState<string | null>(null);


  const INITIAL_STATE: IBoard[] = [];

  const BOARDS_LOCALSTORAGE_KEY = "boards";


  const readData = () => localStorage.getItem(BOARDS_LOCALSTORAGE_KEY);
  const parseData = (readData: string) => {
    try {
      const parsed = JSON.parse(readData);
      if (
        Array.isArray(parsed) &&
        parsed.every((potentialBoard) => isBoard(potentialBoard))
      ) {
        return parsed;
      }
    } catch (err) {
      toast.error(`Ошибка парсинга: ${err instanceof Error ? err.message : 'Unknown error'}`, {
        position: 'top-right',
        duration: 3000
      })
      console.error(err);
    }
  };

  const [prevSerializedState, setPrevSerializedState] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (!!boards?.length || nextBoardID !== null) return;

    setData();

    const savedData = readData() || JSON.stringify(INITIAL_STATE);
    const savedBoards = parseData(savedData) || INITIAL_STATE;
    setPrevSerializedState(savedData);
    setBoards(savedBoards);

    setNextBoardID(crypto.randomUUID());
}, [boards, nextBoardID]);

  const setData = async () => {
    try {
      const response = await fetch("http://localhost:3001/setData");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("There was an error:", error);
    }
  };

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!prevSerializedState) return;

    const newSerializedState = JSON.stringify(boards);
    if (newSerializedState !== prevSerializedState) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [boards, prevSerializedState]);

  const saveData = async () => {
    try {
      const response = await fetch("http://localhost:3001/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: boards }),
      });
      if (!response.ok) {
        throw new Error(`Ошибка при сохранении данных: ${response.status}`);
      }
      console.log("Данные успешно сохранены");
    } catch (error) {
      console.error(error);
    }
  };
  const handleAddBoard = () => {
    if (!boards) throw Error("no boards when add new board");
    if (!nextBoardID) throw Error("Init next board ID error");

    const newBoard = { id: nextBoardID, value: "Новая доска", tasks: [] };
    setBoards([...boards, newBoard]);
    setNextBoardID(nextBoardID + 1);
  };

  const handleBoardChange = (
    boardId: string,
    newValue: string,
    newTasks: ITask[],
  ) => {
    if (!boards) throw Error("no boards when change board");

    const newBoards = structuredClone(boards);
    const changedBoard = newBoards.find((board) => board.id === boardId);
    if (!changedBoard)
      throw new Error(`Cannot find board with board id: ${boardId}`);

    changedBoard.value = newValue;
    changedBoard.tasks = newTasks;
    setBoards(newBoards);
  };

  const handleBoardRemove = (id: string) => {
    if (boards) {
      const replaceIdx = boards.findIndex((t) => t.id === id);
      if (replaceIdx === -1) return;
      const copiedBoards = boards.slice();
      copiedBoards.splice(replaceIdx, 1);
      setBoards(copiedBoards);
    }
};

  const isSaveButtonDisabled = !hasChanges;

  if (!boards) return null;

  const handleBoardsSave = () => {
    const newSerializedState = JSON.stringify(boards);
    localStorage.setItem(BOARDS_LOCALSTORAGE_KEY, newSerializedState);
    setPrevSerializedState(newSerializedState);
    setHasChanges(false);
    saveData();
  };

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
        <button className="addBoardButton" onClick={handleAddBoard}>
          +
        </button>
      </div>
    </div>
  );
};
