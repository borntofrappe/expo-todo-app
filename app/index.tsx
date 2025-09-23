import AppScreen from "@/components/AppScreen";
import TaskList from "@/components/TaskList";
import { Text, View } from "react-native";

export default function Index() {
  const tasks: Task[] = [
    {
      id: new Date("2025-09-23").getTime().toString(),
      value: "Init expo app",
      completed: true,
      selected: false,
    },
    {
      id: new Date("2025-09-24").getTime().toString(),
      value: "Install libs",
      completed: true,
      selected: false,
    },
    {
      id: new Date("2025-09-30").getTime().toString(),
      value: "Finish app",
      completed: false,
      selected: false,
    },
  ];

  const { completed, remaining } = tasks.reduce(
    (acc, curr) => {
      acc[curr.completed === true ? "completed" : "remaining"].push(curr);
      return acc;
    },
    {
      completed: [],
      remaining: [],
    } as { completed: Task[]; remaining: Task[] }
  );
  return (
    <AppScreen>
      <Text className="text-3xl font-light">Tasks</Text>

      <TaskList items={remaining} />
      <View>
        <Text>Completed {completed.length}</Text>
        <TaskList items={completed} />
      </View>
    </AppScreen>
  );
}
