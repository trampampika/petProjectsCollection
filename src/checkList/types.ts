export interface ITask {
  // TODO: make another ID system - absolute unique
  id: number;
  title: string;
  isDone: boolean;
}

export interface IBoard {
  id: number;
  value: string;
  tasks: ITask[];
}
