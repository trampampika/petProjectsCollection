export interface IBoard {
  id: number;
  value: string;
}

export interface ITask {
  // TODO: make same ID system like in Boards
  id?: number;
  text: string;
}
