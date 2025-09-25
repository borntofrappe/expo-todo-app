import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function Placeholder() {
  return (
    <View className="flex gap-4 items-center">
      <View className="relative size-28 justify-center items-center gap-2">
        <View className="absolute left-4 top-3 bg-color-placeholder/10 size-full rounded-3xl" />
        <View className="absolute left-0 top-0 bg-color-placeholder/35 size-full rounded-3xl backdrop-blur-sm" />
        <PlaceholderRow />
        <PlaceholderRow />
      </View>
      <Text className="text-sm text-color-3">No tasks yet.</Text>
    </View>
  );
}

function PlaceholderRow() {
  return (
    <View className="flex flex-row gap-1 items-center">
      <Ionicons
        className="text-background--1"
        name="checkmark-circle-outline"
        size={26}
      />
      <View className="w-5 h-0.5 rounded-sm bg-background--1" />
    </View>
  );
}
