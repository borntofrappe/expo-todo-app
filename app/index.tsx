import AppScreen from "@/components/AppScreen";
import TaskList from "@/components/TaskList";
import TextInputModal from "@/components/TextInputModal";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";

import { slate } from "tailwindcss/colors";

const EnteringAnimation = FadeIn.duration(160).reduceMotion(
  ReduceMotion.System
);
const ExitingAnimation = FadeOut.duration(150).reduceMotion(
  ReduceMotion.System
);

export default function Index() {
  const [tasks, setTasks] = useState<Task[]>([
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
  ]);

  const [mode, setMode] = useState<Mode>("");

  const showInput = () => {
    setMode("input");
  };

  const handleSubmit = (value: string) => {
    // add todo
    const task: Task = {
      id: new Date("2025-09-24").getTime().toString(),
      value,
      completed: false,
      selected: false,
    };
    setTasks((tasks) => [task, ...tasks]);
    setMode("");
  };

  const handleDismiss = () => {
    setMode("");
  };

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

  const buttonScale = useSharedValue(1);

  const buttonSpringConfig: WithSpringConfig = {
    damping: 0.1,
    stiffness: 200,
  };

  const onPressIn = () => {
    buttonScale.value = withSpring(0.9, buttonSpringConfig);
  };

  const onPressOut = () => {
    buttonScale.value = withSpring(1, buttonSpringConfig);
  };

  const buttonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  return (
    <AppScreen>
      <View className="relative flex-1">
        <View className="flex-1 px-3 py-3 gap-3">
          <View className="items-end">
            <Link href={"/settings"}>
              <Ionicons name="settings-outline" color={slate[500]} size={24} />
            </Link>
          </View>
          <Text className="text-3xl font-light">Tasks</Text>

          <TaskList items={remaining} />
          <View>
            <Text>Completed {completed.length}</Text>
            <TaskList items={completed} />
          </View>
        </View>

        {mode === "" && (
          <Animated.View
            entering={EnteringAnimation.delay(75)}
            exiting={ExitingAnimation}
            className="absolute bottom-2 right-3"
          >
            <Pressable
              onPress={showInput}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
            >
              <Animated.View
                style={[buttonStyle]}
                className={"p-2.5 bg-slate-900 rounded-full"}
              >
                <Ionicons name="add" color={slate[50]} size={34} />
              </Animated.View>
            </Pressable>
          </Animated.View>
        )}

        {mode === "input" && (
          <Animated.View
            entering={EnteringAnimation}
            exiting={ExitingAnimation}
            className="absolute w-full h-full bg-slate-800/10"
          />
        )}

        <TextInputModal
          visible={mode === "input"}
          onSubmit={handleSubmit}
          onDismiss={handleDismiss}
        />
      </View>
    </AppScreen>
  );
}
