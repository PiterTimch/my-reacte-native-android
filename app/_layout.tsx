import { Stack } from "expo-router";
import { StatusBar, View } from "react-native";
import "../global.css";

export default function RootLayout() {
  return (
      <View style={{ flex: 1, backgroundColor: "#18181B" }}>
        {/* Задаємо статусбар темним */}
        <StatusBar
            barStyle="light-content"
            backgroundColor="#18181B"
        />

        {/* Stack з усіма екранами */}
        <Stack screenOptions={{ headerShown: false }} />
      </View>
  );
}
