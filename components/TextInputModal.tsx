import { useEffect, useRef, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

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

  useEffect(() => {
    setValue(initialValue || "");
  }, [initialValue]);

  const submit = () => {
    onSubmit(value);
    setValue("");
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onDismiss}
      onPointerDown={onDismiss}
      onShow={() => {
        // expo go android
        const timeoutID = setTimeout(() => {
          textInputRef.current.focus();
          clearTimeout(timeoutID);
        }, 50);
      }}
    >
      <View className="flex-1 justify-end">
        <View
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
          className="mx-2 mb-3 px-4 py-4 gap-4 bg-white shadow-lg elevation-sm-lg shadow-slate-200 rounded-lg"
        >
          <TextInput
            onSubmitEditing={submit}
            onChangeText={setValue}
            value={value}
            ref={textInputRef}
            className="px-1 py-1 outline-none text-base text-slate-800"
            placeholder="New task..."
          />

          <Pressable
            onPress={submit}
            disabled={value === ""}
            className="ml-auto"
          >
            <Text
              className={`font-bold ${value === "" ? "text-slate-400" : "text-sky-500"}`}
            >
              Done
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
