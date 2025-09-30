import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";
import { Modal, Text, TouchableHighlight, View } from "react-native";

type Props = {
  visible: boolean;
  onDismiss?: () => void;
  onCancel: () => void;
  onAction: () => void;
  title: string;
  prompt: string;
  action: string;
};

export default function DangerModal({
  visible,
  onDismiss,
  onCancel,
  onAction,
  title,
  prompt,
  action,
}: Props) {
  const context = useContext(ThemeContext);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onDismiss}
      onPointerDown={onDismiss}
    >
      <View
        className={`${context && context.theme} flex-1 justify-end items-center`}
      >
        <View
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
          className="mx-3 mb-4 px-6 py-6 items-center gap-2 bg-layer-2 shadow-md elevation-md rounded-lg"
        >
          <Text className="font-bold text-text-2">{title}</Text>
          <Text className="text-text-2">{prompt}</Text>
          <View className="mt-3 flex flex-row gap-3 justify-center items-center">
            <TouchableHighlight
              //???
              className="bg-layer-3 px-8 py-3 rounded-xl"
              onPress={onCancel}
            >
              <Text className="font-bold text-text-2">Cancel</Text>
            </TouchableHighlight>
            <TouchableHighlight
              //???
              className="bg-layer-3 px-8 py-3 rounded-xl"
              onPress={onAction}
            >
              <Text className="font-bold text-danger">{action}</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </Modal>
  );
}
