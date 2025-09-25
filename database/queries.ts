import { SQLiteDatabase } from "expo-sqlite";

const DB_NAME = "todos";

export async function initDB(db: SQLiteDatabase) {
  const DB_VERSION = 1;
  const result = await db.getFirstAsync<{
    user_version: number;
  } | null>("PRAGMA user_version");

  const currentVersion = result ? result.user_version : 0;

  if (currentVersion >= DB_VERSION) {
    return;
  }

  if (currentVersion === 0) {
    await db.execAsync(`
PRAGMA journal_mode = 'wal';
CREATE TABLE todos (id TEXT NOT NULL, value TEXT NOT NULL, completed INTEGER);
`);
    await db.execAsync(`PRAGMA user_version = ${DB_VERSION}`);
  }

  // else migration
}

export async function getAllTodos(db: SQLiteDatabase): Promise<Todo[]> {
  const todos = await db.getAllAsync<Todo>(
    "SELECT id, value, completed FROM todos"
  );

  return todos;
}

export async function addTodo(
  db: SQLiteDatabase,
  value: string
): Promise<Todo> {
  const id = new Date().getTime().toString();
  await db.runAsync("INSERT INTO todos (id, value) VALUES (?, ?)", id, value);

  return {
    id,
    value,
    completed: 0,
  };
}

export async function editTodoValue(
  db: SQLiteDatabase,
  id: string,
  newValue: string
): Promise<{
  id: string;
  value: string;
}> {
  await db.runAsync("UPDATE todos SET value = ? WHERE id = ?", newValue, id);

  return {
    id,
    value: newValue,
  };
}

export async function toggleTodoCompleted(
  db: SQLiteDatabase,
  id: string,
  completed: boolean
): Promise<{
  id: string;
  completed: boolean;
}> {
  await db.runAsync(
    "UPDATE todos SET completed = ? WHERE id = ?",
    !completed,
    id
  );

  return {
    id,
    completed: !completed,
  };
}

export async function deleteTodos(
  db: SQLiteDatabase,
  ids: string[]
): Promise<string[]> {
  const placeholders = ids.map(() => "?").join(", ");
  await db.runAsync(`DELETE FROM todos WHERE id IN (${placeholders});`, ids);

  return ids;
}
