import AppScreen from "@/components/AppScreen";
import { ThemeContext } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useContext, useState } from "react";
import { Switch, Text, View } from "react-native";

export default function Settings() {
  const context = useContext(ThemeContext);

  const [darkTheme, setDarkTheme] = useState(false);

  const updateTheme = () => {
    if (context === undefined) return;

    const shouldBeDarkTheme = !darkTheme;

    setDarkTheme(shouldBeDarkTheme);
    context.setTheme(shouldBeDarkTheme ? "dark" : "light");
  };

  return (
    <AppScreen>
      <View className="flex-1 px-3 py-3 gap-3">
        <Link href={"/"}>
          <Ionicons className="text-icon-1" name="arrow-back" size={24} />
        </Link>
        <Text className="text-3xl font-light text-color-2">Settings</Text>

        <View className="gap-2 py-1">
          <Text className="mb-1 text-sm text-color-3 uppercase font-semibold">
            Style
          </Text>
          <View
            className={`${context === undefined ? "opacity-75 cursor-not-allowed" : ""} flex flex-row gap-2 justify-between`}
          >
            <Text className="text-base text-color-2">Dark theme</Text>
            <Switch
              disabled={context === undefined}
              value={darkTheme}
              onValueChange={updateTheme}
            />
          </View>
        </View>
      </View>
    </AppScreen>
  );
}
