import { IBoard, ITask } from './boards/types';

export const isTask = (pTask: unknown): pTask is ITask => {
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

export const isBoard = (pBoard: unknown): pBoard is IBoard => {
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
};
