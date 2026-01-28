import { View, Text, TouchableOpacity } from "react-native";
import { router, usePathname } from "expo-router";

export function AuthTabs() {
    const pathname = usePathname();

    return (
        <View className="px-4 pb-6 bg-zinc-100 dark:bg-zinc-900">
            <View className="flex-row rounded-2xl p-1">
                <Tab
                    label="Вхід"
                    emoji="🔐"
                    active={pathname === "/login"}
                    onPress={() => router.replace("/login")}
                />

                <Tab
                    label="Реєстрація"
                    emoji="✨"
                    active={pathname === "/register"}
                    onPress={() => router.replace("/register")}
                />
            </View>

            <TouchableOpacity
                onPress={() => router.replace("/")}
                className="mt-3 items-center"
            >
                <Text className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    🏠 На головну
                </Text>
            </TouchableOpacity>
        </View>
    );
}

function Tab({
                 label,
                 emoji,
                 active,
                 onPress,
             }: {
    label: string;
    emoji: string;
    active: boolean;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`flex-1 py-3 rounded-xl items-center ${
                active
                    ? "bg-zinc-200 dark:bg-zinc-800"
                    : ""
            }`}
        >
            <Text
                className={`text-base font-semibold ${
                    active
                        ? "text-zinc-900 dark:text-white"
                        : "text-zinc-500 dark:text-zinc-400"
                }`}
            >
                {emoji} {label}
            </Text>
        </TouchableOpacity>
    );
}
