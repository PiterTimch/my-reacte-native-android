import { View, KeyboardAvoidingView, Platform } from "react-native";
import { Slot } from "expo-router";
import { AuthTabs } from "../../components/auth/AuthTabs";

export default function AuthLayout() {
    return (
        <View className="flex-1 bg-white dark:bg-zinc-950">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                className="flex-1"
            >
                <Slot />
            </KeyboardAvoidingView>

            <AuthTabs />
        </View>
    );
}