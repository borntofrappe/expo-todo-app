import AppScreen from "@/components/AppScreen";
import DangerModal from "@/components/DangerModal";
import Placeholder from "@/components/Placeholder";
import TaskList from "@/components/TaskList";
import TextInputModal from "@/components/TextInputModal";
import {
  addTodo,
  deleteTodos,
  editTodoValue,
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

const FadeInAnimation = FadeIn.duration(160).reduceMotion(ReduceMotion.System);

const FadeOutAnimation = FadeOut.duration(160).reduceMotion(
  ReduceMotion.System
);

export default function Index() {
  const db = useSQLiteContext();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  const [mode, setMode] = useState<Mode>("");

  const [showCompleted, setShowCompleted] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const fabScale = useSharedValue(1);
  const fabStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: fabScale.value }],
    };
  });

  const fabSpringConfig: WithSpringConfig = {
    damping: 0.1,
    stiffness: 200,
  };

  const animateFabScale = (toValue: number) => {
    fabScale.value = withSpring(toValue, fabSpringConfig);
  };

  const details = useSharedValue(0);
  const detailsStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${details.value}deg` }],
    };
  });

  useEffect(() => {
    details.value = withTiming(showCompleted ? -180 : 0, {
      duration: 180,
    });
  }, [showCompleted, details]);

  const addTask = async (value: string) => {
    const todo = await addTodo(db, value);

    setTasks((tasks) => [
      {
        ...todo,
        completed: todo.completed === 1,
        selected: false,
      },
      ...tasks,
    ]);
  };

  const editCurrentTask = async (newValue: string) => {
    const { id: currentId, value: currentValue } = currentTask!;

    if (currentValue !== newValue) {
      const { id, value } = await editTodoValue(db, currentId, newValue);
      setTasks((tasks) =>
        tasks.map((task) =>
          task.id === id
            ? {
                ...task,
                value,
              }
            : task
        )
      );
    }
  };

  const toggleTaskCompleted = async (id: string) => {
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

  const toggleTaskSelected = (id: string) => {
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

  const handleFabPress = () => {
    setMode("input");
  };

  const handleSubmit = async (value: string) => {
    if (value === "") {
      setMode("");
      return;
    }

    if (currentTask === undefined) {
      addTask(value);
    } else {
      editCurrentTask(value);
      setCurrentTask(undefined);
    }

    setMode("");
  };

  const handleDismiss = () => {
    setCurrentTask(undefined);
    setMode("");
  };

  const handleItemCheck = (id: string) => {
    toggleTaskCompleted(id);
  };

  const handleItemPress = (id: string) => {
    if (mode === "select") {
      toggleTaskSelected(id);
    } else {
      const task = tasks.find((task) => task.id === id);
      setCurrentTask(task);
      setMode("input");
    }
  };

  const handleItemLongPress = (id: string) => {
    toggleTaskSelected(id);
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

  return (
    <AppScreen>
      <View className="relative flex-1">
        <View className="flex-1 px-3 py-3 gap-3">
          {mode === "select" ? (
            <>
              <View className="flex flex-row justify-between">
                <Pressable onPress={cancelSelection}>
                  <Ionicons className="text-icon-1" name="close" size={24} />
                </Pressable>
                <Pressable onPress={toggleSelection}>
                  <Ionicons
                    className="text-icon-1"
                    name="list-outline"
                    size={24}
                  />
                </Pressable>
              </View>
              <Text className="text-3xl font-light text-color-1">
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
                    className="text-icon-1"
                    name="settings-outline"
                    size={24}
                  />
                </Link>
              </View>
              <Text className="text-3xl font-light text-color-1">Tasks</Text>
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
                  onItemCheck={handleItemCheck}
                  onItemPress={handleItemPress}
                  onItemLongPress={handleItemLongPress}
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
                <Animated.View style={[detailsStyle]} className="p-1">
                  <Ionicons
                    className="text-icon-2"
                    name="chevron-down"
                    size={18}
                  />
                </Animated.View>
                <Text className="text-icon-2 text-sm font-semibold">
                  Completed {completed.length}
                </Text>
              </Pressable>

              {showCompleted && (
                <Animated.View entering={FadeInAnimation}>
                  <TaskList
                    items={completed}
                    onItemCheck={handleItemCheck}
                    onItemPress={handleItemPress}
                    onItemLongPress={handleItemLongPress}
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
              onPress={handleFabPress}
              onPressIn={() => {
                animateFabScale(0.9);
              }}
              onPressOut={() => {
                animateFabScale(1);
              }}
            >
              <Animated.View
                style={[fabStyle]}
                className={"p-2.5 bg-background-fab rounded-full"}
              >
                <Ionicons className="text-color-fab" name="add" size={34} />
              </Animated.View>
            </Pressable>
          </Animated.View>
        )}

        {mode === "select" && (
          <Animated.View entering={FadeInAnimation} exiting={FadeOutAnimation}>
            {/* same bg as scene */}
            <View className="absolute w-full px-2 py-4 bottom-0 bg-background-1">
              <TouchableOpacity
                disabled={selectedCount === 0}
                activeOpacity={0.6}
                onPress={handleDeletion}
              >
                <View
                  className={`margin-auto flex gap-1.5 items-center ${selectedCount === 0 ? "opacity-50" : ""}`}
                >
                  <Ionicons
                    className="text-xs text-color-2"
                    name="trash-bin-outline"
                    size={24}
                  />
                  <Text className="text-xs text-color-2">Delete</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {mode === "input" && (
          <Animated.View
            entering={FadeInAnimation}
            exiting={FadeOutAnimation}
            className="absolute w-full h-full bg-background-modal"
          />
        )}

        <TextInputModal
          visible={mode === "input"}
          onSubmit={handleSubmit}
          onDismiss={handleDismiss}
          initialValue={currentTask?.value}
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
