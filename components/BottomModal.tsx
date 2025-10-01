import { ThemeContext } from "@/context/ThemeContext";
import { PropsWithChildren, useContext } from "react";
import { Modal, TouchableWithoutFeedback, View } from "react-native";

type Props = PropsWithChildren & {
  visible: boolean;
  onDismiss: () => void;
  onShow?: () => void;
};

export default function BottomModal({
  visible,
  onDismiss,
  onShow,
  children,
}: Props) {
  const context = useContext(ThemeContext);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onShow={onShow}
      onRequestClose={onDismiss}
    >
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View className={`${context && context.theme} flex-1 justify-end`}>
          <TouchableWithoutFeedback
            onPress={(e) => {
              e.stopPropagation();
            }}
          >
            {children}
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
