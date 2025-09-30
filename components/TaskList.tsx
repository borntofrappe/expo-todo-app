import colors from "@/constants/colors";
import { ThemeContext } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
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
  const context = useContext(ThemeContext);
  const themeColor: "light" | "dark" =
    context && context.theme === "dark" ? "dark" : "light";

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
          colors={[
            colors[themeColor]["icon-checked"],
            colors[themeColor]["icon-unchecked"],
            colors[themeColor]["icon-selected"],
            colors[themeColor]["icon-unselected"],
          ]}
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
  colors: [string, string, string, string];
};
function TaskItem({
  item,
  onItemCheck,
  onItemPress,
  onItemLongPress,
  canBeSelected,
  colors,
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
  const textStyle = item.completed ? "text-text-5" : "text-text-1";
  const iconStart: IoniconsName = item.completed
    ? "checkbox"
    : "square-outline";
  const iconEnd: IoniconsName = item.selected
    ? "checkmark-circle"
    : "checkmark-circle-outline";

  const iconStartColor = item.completed ? colors[0] : colors[1];
  const iconEndColor = item.selected ? colors[2] : colors[3];

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
          className={`px-3 py-4 rounded-md flex flex-row gap-1 items-center ${item.selected ? "bg-layer-3" : "bg-layer-2 shadow-sm elevation-sm"}`}
        >
          <Pressable
            onPress={(e) => {
              onItemCheck(item.id);
            }}
            className={`p-1 ${canBeSelected && "invisible"}`}
          >
            <Ionicons name={iconStart} color={iconStartColor} size={18} />
          </Pressable>
          <Text className={`text-base font-bold ${textStyle}`}>
            {item.value}
          </Text>
          <View className={`ml-auto p-1 ${!canBeSelected && "invisible"}`}>
            <Ionicons name={iconEnd} color={iconEndColor} size={24} />
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}
