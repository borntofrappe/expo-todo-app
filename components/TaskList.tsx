import { Ionicons } from "@expo/vector-icons";
import { FlatList, Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type IoniconsName = keyof typeof Ionicons.glyphMap;

type Props = {
  items: Task[];
  onItemCheck: (id: string) => void;
  onItemPress: (id: string) => void;
  onItemLongPress: (id: string) => void;
  canBeSelected?: boolean;
};

export default function TaskList({
  items,
  onItemCheck,
  onItemPress,
  onItemLongPress,
  canBeSelected,
}: Props) {
  return (
    <FlatList
      className="overflow-visible"
      contentContainerClassName="gap-2"
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TaskItem
          item={item}
          onItemCheck={onItemCheck}
          onItemPress={onItemPress}
          onItemLongPress={onItemLongPress}
          canBeSelected={canBeSelected || false}
        />
      )}
    />
  );
}

type ItemProps = {
  item: Task;
  onItemCheck: (id: string) => void;
  onItemPress: (id: string) => void;
  onItemLongPress: (id: string) => void;
  canBeSelected: boolean;
};
function TaskItem({
  item,
  onItemCheck,
  onItemPress,
  onItemLongPress,
  canBeSelected,
}: ItemProps) {
  const itemScale = useSharedValue(1);
  const onPressIn = () => {
    itemScale.value = withSpring(0.96);
  };

  const onPressOut = () => {
    itemScale.value = withSpring(1);
  };

  const itemStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: itemScale.value }],
    };
  });
  const textStyle = item.completed ? "text-color-empty" : "text-color-2";
  const iconStart: IoniconsName = item.completed
    ? "checkbox"
    : "square-outline";
  const iconEnd: IoniconsName = item.selected
    ? "checkmark-circle"
    : "checkmark-circle-outline";
  const iconEndStyle = item.selected ? "text-color-theme" : "text-icon-1";

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={() => {
        onItemPress(item.id);
      }}
      onLongPress={() => {
        onItemLongPress(item.id);
        onPressOut();
      }}
    >
      <Animated.View style={[itemStyle]}>
        <View
          className={`px-3 py-4 rounded-md flex flex-row gap-1 items-center ${item.selected ? "bg-background-3 drop-shadow-sm elevation-sm" : "bg-background--1 drop-shadow-md elevation-md"} shadow-shadow-1`}
        >
          <Pressable
            onPress={(e) => {
              onItemCheck(item.id);
            }}
            className={`p-1 ${canBeSelected && "invisible"}`}
          >
            <Ionicons className="text-icon-1" name={iconStart} size={18} />
          </Pressable>
          <Text className={`text-base font-bold ${textStyle}`}>
            {item.value}
          </Text>
          <View className={`ml-auto p-1 ${!canBeSelected && "invisible"}`}>
            <Ionicons className={iconEndStyle} name={iconEnd} size={24} />
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}
