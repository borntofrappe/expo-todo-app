import { ThemeContext } from "@/context/ThemeContext";
import { PropsWithChildren, useContext } from "react";
import { View } from "react-native";

export default function AppScreen({ children }: PropsWithChildren) {
  const context = useContext(ThemeContext);

  return (
    <View className={`${context && context.theme} flex-1 bg-background-1`}>
      <View className="flex-1 w-full max-w-[600px] mx-auto">{children}</View>
    </View>
  );
}
