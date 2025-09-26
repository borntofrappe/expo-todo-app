import { Theme, ThemeContext } from "@/context/ThemeContext";
import { PropsWithChildren, useState } from "react";
import { View } from "react-native";

export default function AppScreen({ children }: PropsWithChildren) {
  const [sharedTheme, setSharedTheme] = useState<Theme>("light");
  const setTheme = (value: Theme) => {
    setSharedTheme(value);
  };

  return (
    <ThemeContext.Provider value={{ theme: sharedTheme, setTheme }}>
      <View className={`${sharedTheme} flex-1 bg-background-1`}>
        <View className="flex-1 w-full max-w-[600px] mx-auto">{children}</View>
      </View>
    </ThemeContext.Provider>
  );
}
