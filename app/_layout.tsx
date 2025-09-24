import { Tabs } from "expo-router";
import { Dimensions } from "react-native";
import { gray } from "tailwindcss/colors";
import "../styles/global.css";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
export default function TabsLayout() {
  const backgroundColor = gray[50];
  const transitionDuration = 280;

  return (
    <SQLiteProvider databaseName="todos.db" onInit={onInit}>
      <Tabs
        screenOptions={{
          sceneStyle: {
            backgroundColor,
          },
          headerShown: false,
          tabBarStyle: {
            display: "none", // uncomment when handling navigation between the two tabs
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
    </SQLiteProvider>
  );
}

async function onInit(db: SQLiteDatabase) {
  const DB_VERSION = 1;
  let result = await db.getFirstAsync<{
    user_version: number;
  } | null>("PRAGMA user_version");

  const currentVersion = result ? result.user_version : 0;

  if (currentVersion >= DB_VERSION) {
    return;
  }

  if (currentVersion === 0) {
    await db.execAsync(`
PRAGMA journal_mode = 'wal';
CREATE TABLE todos (id TEXT NOT NULL, value TEXT NOT NULL, completed INTEGER);
`);
    await db.execAsync(`PRAGMA user_version = ${DB_VERSION}`);
  }

  // else migration
}
