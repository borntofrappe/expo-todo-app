import { Tabs } from "expo-router";
import { Dimensions } from "react-native";
import { gray } from "tailwindcss/colors";
import "../styles/global.css";

export default function TabsLayout() {
  const backgroundColor = gray[50];
  const transitionDuration = 280;

  return (
    <Tabs
      screenOptions={{
        sceneStyle: {
          backgroundColor,
        },
        headerShown: false,
        tabBarStyle: {
          // display: "none", // uncomment when handling navigation between the two tabs
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
  );
}
