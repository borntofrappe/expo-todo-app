import AppScreen from "@/components/AppScreen";
import colors from "@/constants/colors";
import { ThemeContext } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export default function Settings() {
  const context = useContext(ThemeContext);
  const themeColor: "light" | "dark" =
    context && context.theme === "dark" ? "dark" : "light";

  const iconBase = colors[themeColor]["icon-base"];

  const iconTranslateY = useSharedValue(0);
  const iconDistanceY = 200;
  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: `${iconTranslateY.value * iconDistanceY * -1}%` },
      ],
    };
  });

  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    (async () => {
      const json = await AsyncStorage.getItem("app-preferences");

      const appPreferences =
        json === null ? null : (JSON.parse(json) as AppPreferences);

      if (appPreferences) {
        if (appPreferences.theme === "dark") {
          setDarkTheme(true);
          iconTranslateY.value = 1;
        }
      }
    })();
  }, []);

  const toggleTheme = async () => {
    if (context === undefined) return;

    const shouldBeDarkTheme = !darkTheme;
    const theme = shouldBeDarkTheme ? "dark" : "light";

    try {
      const jsonValue = JSON.stringify({
        theme,
      });
      await AsyncStorage.setItem("app-preferences", jsonValue);

      iconTranslateY.value = withSpring(shouldBeDarkTheme ? 1 : 0, {
        damping: 13,
        stiffness: 120,
      });
      setDarkTheme(shouldBeDarkTheme);
      context.setTheme(theme);
    } catch (e) {}
  };

  return (
    <AppScreen>
      <View className="flex-1 px-3 py-3 gap-3">
        <View className="flex flex-row justify-between items-center">
          <Link href={"/"}>
            <Ionicons name="arrow-back" color={iconBase} size={24} />
          </Link>
          <Pressable
            onPress={toggleTheme}
            disabled={context === undefined}
            className={`${context === undefined ? "invisible" : ""}`}
          >
            <View className="relative overflow-hidden">
              <Animated.View style={[iconStyle]}>
                <View className="relative">
                  <Ionicons name="sunny" color={iconBase} size={22} />
                </View>
                <View
                  className={`absolute w-full h-full items-center justify-center top-[${`${iconDistanceY}%`}]`}
                >
                  <Ionicons name="moon" color={iconBase} size={16} />
                </View>
              </Animated.View>
            </View>
          </Pressable>
        </View>
        <Text className="text-3xl font-light text-text-2">Settings?</Text>
        <Text className="text-text-2">
          Likely turned to something more useful than just setting dark theme
        </Text>
      </View>
    </AppScreen>
  );
}
