import { PropsWithChildren } from "react";
import { View } from "react-native";

export default function AppScreen({ children }: PropsWithChildren) {
  return (
    <View className="flex-1 w-full max-w-[600px] mx-auto">{children}</View>
  );
}
