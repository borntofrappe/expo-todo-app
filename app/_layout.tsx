import { ThemeContext } from "@/context/ThemeContext";
import { initDB } from "@/database/queries";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tabs } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import "../styles/global.css";

export default function TabsLayout() {
  const tabTransitionDuration = 280;

  const [sharedTheme, setSharedTheme] = useState<Theme>("light");

  const setTheme = (value: Theme) => {
    setSharedTheme(value);
  };

  const colors = ["hsl(215, 19%, 35%)", "hsl(215, 20%, 65%)"];
  const backgroundColors = ["hsl(210, 40%, 98%)", "hsl(222, 47%, 11%)"];

  const color = useSharedValue(colors[0]);
  const backgroundColor = useSharedValue(backgroundColors[0]);
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);

  const colorStyle = useAnimatedStyle(() => {
    return {
      color: color.value,
    };
  });

  const backgroundStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: backgroundColor.value,
    };
  });

  const opacityStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const translateXStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: `${translateX.value * 100 - -1}%`,
        },
      ],
    };
  });

  const initialDelay = 1000;
  const durations = [1000, 1000];
  useEffect(() => {
    (async () => {
      const json = await AsyncStorage.getItem("app-preferences");
      const appPreferences =
        json === null ? null : (JSON.parse(json) as AppPreferences);
      if (appPreferences) {
        setTheme(appPreferences.theme);
      }

      await new Promise((resolve) => setTimeout(resolve, initialDelay));

      const theme = appPreferences ? appPreferences.theme : sharedTheme;

      const appColor = theme === "dark" ? colors[1] : colors[0];
      const appBackground =
        theme === "dark" ? backgroundColors[1] : backgroundColors[0];

      const duration = theme === "dark" ? durations[0] : 0;
      color.value = withTiming(appColor, { duration });
      backgroundColor.value = withTiming(
        appBackground,
        { duration },
        async (finished) => {
          if (finished) {
            await new Promise((resolve) => setTimeout(resolve, durations[1]));
            opacity.value = withTiming(
              0,
              { duration: durations[1] },
              (finished) => {
                if (finished) {
                  translateX.value = 1;
                }
              }
            );
          }
        }
      );
    })();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: sharedTheme, setTheme }}>
      <SQLiteProvider databaseName="todos.db" onInit={initDB}>
        <View className="relative flex-1">
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarStyle: {
                display: "none",
              },
              transitionSpec: {
                animation: "timing",
                config: {
                  duration: tabTransitionDuration,
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

          <Animated.View
            style={[opacityStyle, backgroundStyle, translateXStyle]}
            className="absolute top-0 left-0 w-full h-full justify-center items-center"
          >
            <Animated.Text
              style={[colorStyle]}
              className="relative overflow-hidde text-sm text-color-3"
            >
              And so it begins
            </Animated.Text>
          </Animated.View>
        </View>
      </SQLiteProvider>
    </ThemeContext.Provider>
  );
}
