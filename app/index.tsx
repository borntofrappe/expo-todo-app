import AppScreen from "@/components/AppScreen";
import DangerModal from "@/components/DangerModal";
import Placeholder from "@/components/Placeholder";
import TaskList from "@/components/TaskList";
import TextInputModal from "@/components/TextInputModal";
import {
  addTodo,
  deleteTodos,
  getAllTodos,
  toggleTodoCompleted,
} from "@/database/queries";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
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

import { sky, slate } from "tailwindcss/colors";

const FadeInAnimation = FadeIn.duration(160).reduceMotion(ReduceMotion.System);

const FadeOutAnimation = FadeOut.duration(160).reduceMotion(
  ReduceMotion.System
);

export default function Index() {
  const db = useSQLiteContext();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    (async () => {
      const todos = await getAllTodos(db);
      setTasks(
        todos.map((todo) => ({
          ...todo,
          completed: todo.completed === 1,
          selected: false,
        }))
      );
    })();
  }, []);

  const [mode, setMode] = useState<Mode>("");
  const [showCompleted, setShowCompleted] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const showInput = () => {
    setMode("input");
  };

  const handleSubmit = async (value: string) => {
    const todo = await addTodo(db, value);

    setTasks((tasks) => [
      {
        ...todo,
        completed: todo.completed === 1,
        selected: false,
      },
      ...tasks,
    ]);
    setMode("");
  };

  const handleDismiss = () => {
    setMode("");
  };

  const toggleItemCompleted = async (id: string) => {
    const index = tasks.findIndex((task) => task.id === id);
    if (index === -1) return;

    const { completed } = await toggleTodoCompleted(
      db,
      id,
      tasks[index].completed
    );

    setTasks((tasks) => {
      return [
        {
          ...tasks[index],
          completed,
        },
        ...tasks.slice(0, index),
        ...tasks.slice(index + 1),
      ];
    });
  };

  const toggleItemSelected = (id: string) => {
    setMode("select");
    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              selected: !task.selected,
            }
          : task
      )
    );
  };

  const toggleShowCompleted = () => {
    setShowCompleted((d) => !d);
  };

  const handleCheck = (id: string) => {
    toggleItemCompleted(id);
  };

  const handlePress = (id: string) => {
    if (mode === "select") {
      toggleItemSelected(id);
    }
  };

  const handleLongPress = (id: string) => {
    toggleItemSelected(id);
  };

  const cancelSelection = () => {
    setMode("");
    setTasks((tasks) =>
      tasks.map((task) => ({
        ...task,
        selected: false,
      }))
    );
  };

  const toggleSelection = () => {
    const notAllSelected = !tasks.every((task) => task.selected === true);
    setTasks((tasks) =>
      tasks.map((task) => ({
        ...task,
        selected: notAllSelected,
      }))
    );
  };

  const deleteSelected = async () => {
    const selectedIDs = tasks
      .filter((task) => task.selected === true)
      .map((task) => task.id);

    const ids = await deleteTodos(db, selectedIDs);

    setTasks((tasks) => tasks.filter((task) => !ids.includes(task.id)));
    setShowDeleteModal(false);
    setMode("");
  };

  const handleDeletion = () => {
    if (selectedCount === 0) return;

    setShowDeleteModal(true);
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

  const selectedCount = tasks.reduce(
    (acc, curr) => (curr.selected ? acc + 1 : acc),
    0
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
        <View className="flex-1 px-3 py-3 gap-3">
          {mode === "select" ? (
            <>
              <View className="flex flex-row justify-between">
                <Pressable onPress={cancelSelection}>
                  <Ionicons name="close" color={slate[500]} size={24} />
                </Pressable>
                <Pressable onPress={toggleSelection}>
                  <Ionicons name="list-outline" color={slate[500]} size={24} />
                </Pressable>
              </View>
              <Text className="text-3xl font-light">
                {selectedCount === 0
                  ? "Select items"
                  : `${selectedCount} items selected`}
              </Text>
            </>
          ) : (
            <>
              <View className="items-end">
                <Link href={"/settings"}>
                  <Ionicons
                    name="settings-outline"
                    color={slate[500]}
                    size={24}
                  />
                </Link>
              </View>
              <Text className="text-3xl font-light">Tasks</Text>
            </>
          )}

          {remaining.length + completed.length === 0 && (
            <Animated.View
              entering={FadeInAnimation}
              exiting={FadeOutAnimation}
              className="flex-[0.67] justify-center items-center"
            >
              <Placeholder />
            </Animated.View>
          )}

          {remaining.length > 0 && (
            <>
              <Animated.View entering={FadeInAnimation}>
                <TaskList
                  items={remaining}
                  onItemCheck={handleCheck}
                  onItemPress={handlePress}
                  onItemLongPress={handleLongPress}
                  canBeSelected={mode === "select"}
                />
              </Animated.View>
              <View className="h-2" />
            </>
          )}

          {completed.length > 0 && (
            <View className="gap-1.5">
              <Pressable
                onPress={toggleShowCompleted}
                className="flex flex-row items-center"
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
                <Animated.View entering={FadeInAnimation}>
                  <TaskList
                    items={completed}
                    onItemCheck={handleCheck}
                    onItemPress={handlePress}
                    onItemLongPress={handleLongPress}
                    canBeSelected={mode === "select"}
                  />
                </Animated.View>
              )}
            </View>
          )}
        </View>

        {mode === "" && (
          <Animated.View
            entering={FadeInAnimation.delay(75)}
            exiting={FadeOutAnimation}
            className="absolute bottom-2 right-3"
          >
            <Pressable
              onPress={showInput}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
            >
              <Animated.View
                style={[buttonStyle]}
                className={"p-2.5 bg-sky-400 rounded-full"}
              >
                <Ionicons name="add" color={sky[50]} size={34} />
              </Animated.View>
            </Pressable>
          </Animated.View>
        )}

        {mode === "select" && (
          <Animated.View entering={FadeInAnimation} exiting={FadeOutAnimation}>
            {/* same bg as scene */}
            <View className="absolute w-full px-2 py-4 bottom-0 bg-slate-50">
              <TouchableOpacity
                disabled={selectedCount === 0}
                activeOpacity={0.6}
                onPress={handleDeletion}
              >
                <View
                  className={`margin-auto flex gap-1 items-center ${selectedCount === 0 ? "opacity-50" : ""}`}
                >
                  <Ionicons name="trash-bin-outline" size={24} />
                  <Text className="text-xs text-slate-700">Delete</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {mode === "input" && (
          <Animated.View
            entering={FadeInAnimation}
            exiting={FadeOutAnimation}
            className="absolute w-full h-full bg-slate-800/10"
          />
        )}

        <TextInputModal
          visible={mode === "input"}
          onSubmit={handleSubmit}
          onDismiss={handleDismiss}
        />

        <DangerModal
          visible={showDeleteModal}
          onDismiss={() => {
            setShowDeleteModal(false);
          }}
          onCancel={() => {
            setShowDeleteModal(false);
          }}
          onAction={deleteSelected}
          title="Delete completed tasks"
          prompt={`Delete ${selectedCount === 1 ? "1 task" : `${selectedCount} tasks`}?`}
          action="Delete"
        />
      </View>
    </AppScreen>
  );
}
