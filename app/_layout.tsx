import { initDB } from "@/database/queries";
import { Tabs } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { Dimensions } from "react-native";
import "../styles/global.css";

export default function TabsLayout() {
  const transitionDuration = 280;

  return (
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
  );
}
