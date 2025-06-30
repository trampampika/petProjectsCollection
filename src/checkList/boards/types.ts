export interface ITask {
  id: string;
  title: string;
  isDone: boolean;
}

export interface IBoard {
  id: string;
  value: string;
  tasks: ITask[];
}

export interface IMoodCalendar {
  moodDays: IMoodDay[];
  year: string;
  month: string;
}



export interface IMoodDay {
  id: string;
  dayOfTheMonth: number;
  dayStyle: string;

  ////should not be here
  ////should be in calendar or above
  ////extract
  isMoodChoosing: boolean;
}
