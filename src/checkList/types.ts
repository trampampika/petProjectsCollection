export interface ITask {
  //// make another ID system - absolute unique
  id: number;
  title: string;
}

export interface IBoard {
  id: number;
  value: string;
  tasks: ITask[];
}
