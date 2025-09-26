import { Theme, ThemeContext } from "@/context/ThemeContext";
import { initDB } from "@/database/queries";
import { Tabs } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { useState } from "react";
import { Dimensions } from "react-native";
import "../styles/global.css";

export default function TabsLayout() {
  const transitionDuration = 280;

  const [sharedTheme, setSharedTheme] = useState<Theme>("light");
  const setTheme = (value: Theme) => {
    setSharedTheme(value);
  };

  return (
    <ThemeContext.Provider value={{ theme: sharedTheme, setTheme }}>
      <SQLiteProvider databaseName="todos.db" onInit={initDB}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              display: "none",
            },
            transitionSpec: {
              animation: "timing",
              config: {
                duration: transitionDuration,
              },
            },
            sceneStyleInterpolator: ({ current }) => {
              const { width } = Dimensions.get("window");

              const translateX = current.progress.interpolate({
                inputRange: [-1, 0, 1],
                outputRange: [-width, 0, width],
              });
              return {
                sceneStyle: {
                  transform: [{ translateX }],
                },
              };
            },
          }}
        ></Tabs>
      </SQLiteProvider>
    </ThemeContext.Provider>
  );
}
