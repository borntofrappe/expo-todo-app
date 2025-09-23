import AppScreen from "@/components/AppScreen";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { slate } from "tailwindcss/colors";

export default function Settings() {
  return (
    <AppScreen>
      <View className="flex-1 px-3 py-3 gap-3">
        <Link href={"/"}>
          <Ionicons name="arrow-back" color={slate[500]} size={24} />
        </Link>
        <Text className="text-3xl font-light">Settings</Text>
      </View>
    </AppScreen>
  );
}
