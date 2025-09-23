import AppScreen from "@/components/AppScreen";
import TaskList from "@/components/TaskList";
import TextInputModal from "@/components/TextInputModal";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
  withTiming,
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
  const [showCompleted, setShowCompleted] = useState(false);

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

  const toggleItemCompleted = (id: string) => {
    const index = tasks.findIndex((task) => task.id === id);
    if (index === -1) return;

    const { completed } = tasks[index];

    setTasks((tasks) => {
      return [
        {
          ...tasks[index],
          completed: !completed,
        },
        ...tasks.slice(0, index),
        ...tasks.slice(index + 1),
      ];
    });
  };

  const toggleShowCompleted = () => {
    setShowCompleted((d) => !d);
  };

  const handleCheck = (id: string) => {
    toggleItemCompleted(id);
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

  const chevronRotation = useSharedValue(0);
  const chevronStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${chevronRotation.value}deg` }],
    };
  });

  useEffect(() => {
    chevronRotation.value = withTiming(showCompleted ? -180 : 0, {
      duration: 180,
    });
  }, [showCompleted, chevronRotation]);

  return (
    <AppScreen>
      <View className="relative flex-1">
        <View className="flex-1 px-3 py-3 gap-2">
          <View className="items-end">
            <Link href={"/settings"}>
              <Ionicons name="settings-outline" color={slate[500]} size={24} />
            </Link>
          </View>
          <Text className="text-3xl font-light">Tasks</Text>

          <TaskList items={remaining} mode={mode} onItemCheck={handleCheck} />

          {completed.length > 0 && (
            <View className="gap-2">
              <Pressable
                onPress={toggleShowCompleted}
                className="px-1 flex flex-row items-center"
              >
                <Animated.View style={[chevronStyle]} className="p-1">
                  <Ionicons
                    className="text-slate-400"
                    name="chevron-down"
                    size={18}
                  />
                </Animated.View>
                <Text className="text-slate-400 text-sm font-semibold">
                  Completed {completed.length}
                </Text>
              </Pressable>

              {showCompleted && (
                <TaskList
                  items={completed}
                  mode={mode}
                  onItemCheck={handleCheck}
                />
              )}
            </View>
          )}
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
