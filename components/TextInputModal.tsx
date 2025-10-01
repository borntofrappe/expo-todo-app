import colors from "@/constants/colors";
import { ThemeContext } from "@/context/ThemeContext";
import { useContext, useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import BottomModal from "./BottomModal";

type Props = {
  visible: boolean;
  onSubmit: (value: string) => void;
  onDismiss: () => void;
  initialValue?: string;
};

export default function TextInputModal({
  visible,
  onSubmit,
  onDismiss,
  initialValue,
}: Props) {
  const [value, setValue] = useState("");
  const textInputRef = useRef<TextInput>(null!);
  const context = useContext(ThemeContext);
  const themeColor: "light" | "dark" =
    context && context.theme === "dark" ? "dark" : "light";

  useEffect(() => {
    setValue(initialValue || "");
  }, [initialValue]);

  const submit = () => {
    onSubmit(value);
    setValue("");
  };

  return (
    <BottomModal
      visible={visible}
      onDismiss={onDismiss}
      onShow={() => {
        const timeoutID = setTimeout(() => {
          textInputRef.current.focus();
          clearTimeout(timeoutID);
        }, 50);
      }}
    >
      <View className="mx-2 mb-3 px-4 py-4 gap-4 bg-layer-2 shadow-md elevation-md rounded-lg">
        <TextInput
          onSubmitEditing={submit}
          onChangeText={setValue}
          value={value}
          ref={textInputRef}
          className="px-1 py-1 outline-none text-base text-text-1"
          placeholder="New task..."
          placeholderTextColor={colors[themeColor]["placeholder-text"]}
        />

        <Pressable onPress={submit} disabled={value === ""} className="ml-auto">
          <Text
            className={`font-bold ${value === "" ? "text-text-5" : "text-theme"}`}
          >
            Done
          </Text>
        </Pressable>
      </View>
    </BottomModal>
  );
}
