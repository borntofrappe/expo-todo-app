import { ThemeContext } from "@/context/ThemeContext";
import { PropsWithChildren, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppScreen({ children }: PropsWithChildren) {
  const context = useContext(ThemeContext);

  return (
    <SafeAreaView
      className={`${context && context.theme} flex-1 bg-background-1`}
    >
      {children}
    </SafeAreaView>
  );
}
