import { ThemeContext } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SpringConfig } from "react-native-reanimated/lib/typescript/animation/spring";

import colors from "@/constants/colors";

type Props = {
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  size?: number;
};

export default function FloatingActionButton(props: Props) {
  const context = useContext(ThemeContext);
  const themeColor: "light" | "dark" =
    context && context.theme === "dark" ? "dark" : "light";
  const color = colors[themeColor]["fab-color"];
  const backgroundColor = colors[themeColor]["fab-background"];

  const { onPress, icon, size = 36 } = props;

  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const config: SpringConfig = {
    damping: 20,
    stiffness: 250,
  };

  const onPressIn = () => {
    scale.value = withSpring(0.9, config);
  };

  const onPressOut = () => {
    scale.value = withSpring(1, config);
  };
  return (
    <View className="absolute bottom-2 right-3">
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <Animated.View style={[style]}>
          <Ionicons
            className="p-2.5 rounded-full"
            color={color}
            style={{
              backgroundColor,
            }}
            name={icon}
            size={size}
          />
        </Animated.View>
      </Pressable>
    </View>
  );
}
