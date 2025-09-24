import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Placeholder() {
  return (
    <View className="flex gap-4 items-center">
      <View className="relative size-28 justify-center items-center gap-2">
        <View className="absolute left-4 top-3 bg-sky-500/10 size-full rounded-3xl" />
        <View className="absolute left-0 top-0 bg-sky-500/35 size-full rounded-3xl backdrop-blur-sm" />
        <PlaceholderRow />
        <PlaceholderRow />
      </View>
      <Text className="text-sm text-slate-600">No tasks yet.</Text>
    </View>
  );
}

function PlaceholderRow() {
  return (
    <View className="flex flex-row gap-1 items-center">
      <Ionicons name="checkmark-circle-outline" size={24} color="white" />
      <View className="w-7 h-1 rounded-sm bg-white" />
    </View>
  );
}
