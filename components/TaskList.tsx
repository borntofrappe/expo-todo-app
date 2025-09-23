import { Ionicons } from "@expo/vector-icons";
import { FlatList, Pressable, Text, View } from "react-native";
import { sky, slate } from "tailwindcss/colors";

type IoniconsName = keyof typeof Ionicons.glyphMap;

type Props = {
  items: Task[];
  mode: Mode;
  onItemCheck: (id: string) => void;
};

export default function TaskList({ items, mode, onItemCheck }: Props) {
  return (
    <FlatList
      className="overflow-visible"
      contentContainerClassName="gap-2"
      data={items}
      keyExtractor={(task) => task.id}
      renderItem={(task) => {
        const { item } = task;

        const textStyle = item.completed ? "text-slate-400" : "text-slate-700";

        const iconStart: IoniconsName = item.completed
          ? "checkbox"
          : "square-outline";
        const iconEnd: IoniconsName = item.selected
          ? "checkmark-circle"
          : "checkmark-circle-outline";
        const iconEndColor = item.selected ? sky[500] : slate[500];

        return (
          <View
            className={`px-3 py-4 rounded-md flex flex-row gap-1 items-center ${item.selected ? "bg-slate-200 brightness-90 drop-shadow-sm elevation-sm" : "bg-white drop-shadow-md elevation-md"} shadow-slate-300`}
          >
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                onItemCheck(item.id);
              }}
              className="p-1"
            >
              <Ionicons color={slate[400]} name={iconStart} size={18} />
            </Pressable>
            <Text className={`text-base font-bold ${textStyle}`}>
              {item.value}
            </Text>
            <View className="ml-auto p-1 invisible">
              <Ionicons color={iconEndColor} name={iconEnd} size={24} />
            </View>
          </View>
        );
      }}
    />
  );
}
