import { FlatList, Text, View } from "react-native";

type Props = {
  items: Task[];
};

export default function TaskList({ items }: Props) {
  return (
    <FlatList
      data={items}
      keyExtractor={(task) => task.id}
      renderItem={(task) => {
        const { item } = task;
        return (
          <View>
            <Text>{item.value}</Text>
          </View>
        );
      }}
    />
  );
}
