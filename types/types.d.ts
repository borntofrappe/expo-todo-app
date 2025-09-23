type Todo = {
  id: string;
  value: string;
  completed: number;
};

type Task = Pick<Todo, "id" | "value"> & {
  completed: boolean;
  selected: boolean;
};
