import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import colors from "@/constants/colors";
import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";

export default function Placeholder() {
  const context = useContext(ThemeContext);
  const themeColor: "light" | "dark" =
    context && context.theme === "dark" ? "dark" : "light";
  const color = colors[themeColor]["illustration-fg"];
  const backgroundColor = colors[themeColor]["illustration-bg"];

  return (
    <View className="flex gap-4 items-center">
      <View className="relative justify-center items-center size-[92px] gap-[3px]">
        <View
          style={{ backgroundColor }}
          className="absolute left-4 top-3 opacity-10 size-full rounded-3xl"
        />
        <View
          style={{ backgroundColor }}
          className="absolute left-0 top-0 opacity-35 size-full rounded-3xl backdrop-blur-sm"
        />
        <PlaceholderRow color={color} />
        <PlaceholderRow color={color} />
      </View>
      <Text className="text-sm text-text-2">No tasks yet.</Text>
    </View>
  );
}

function PlaceholderRow({ color }: { color: string }) {
  return (
    <View className="flex flex-row gap-[3px] items-center">
      <Ionicons name="checkmark-circle-outline" color={color} size={28} />
      <View
        style={{ backgroundColor: color }}
        className="w-[20px] h-[3px] rounded-sm"
      />
    </View>
  );
}
