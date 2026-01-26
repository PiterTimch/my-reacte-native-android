import { Text, View, StatusBar, TouchableOpacity, TextInput, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

export default function RegisterScreen() {
    return (
        <View className="flex-1 bg-zinc-50 dark:bg-zinc-950">
            <StatusBar barStyle="default" />

            <LinearGradient
                colors={["rgba(16,185,129,0.35)", "transparent"]}
                className="absolute w-full h-[380px] rounded-full blur-[120px]"
            />

            <SafeAreaView className="flex-1 px-8 py-16">
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
                >
                    {/* Заголовок */}
                    <View className="items-center mt-6">
                        <Text className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">
                            Реєстрація
                        </Text>
                        <View className="h-[2px] w-12 bg-emerald-500 my-6 rounded-full" />
                        <Text className="text-zinc-500 dark:text-zinc-400 text-center text-lg leading-7 font-medium px-4">
                            Створіть свій профіль, щоб почати використовувати додаток
                        </Text>
                    </View>

                    {/* Аватарка */}
                    <View className="items-center my-8">
                        <TouchableOpacity
                            activeOpacity={0.8}
                            className="w-36 h-36 rounded-full bg-emerald-500/10 items-center justify-center"
                        >
                            <Text className="text-9xl">🐣</Text>
                        </TouchableOpacity>
                        <Text className="text-zinc-400 dark:text-zinc-500 mt-2">
                            Натисніть, щоб обрати фото
                        </Text>
                    </View>

                    {/* Поля */}
                    <View className="gap-y-4">
                        <TextInput
                            placeholder="Ім'я"
                            placeholderTextColor="#9ca3af"
                            className="bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white text-base"
                        />
                        <TextInput
                            placeholder="Прізвище"
                            placeholderTextColor="#9ca3af"
                            className="bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white text-base"
                        />
                        <TextInput
                            placeholder="Пароль"
                            placeholderTextColor="#9ca3af"
                            secureTextEntry
                            className="bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white text-base"
                        />
                        <TextInput
                            placeholder="Підтвердьте пароль"
                            placeholderTextColor="#9ca3af"
                            secureTextEntry
                            className="bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white text-base"
                        />
                    </View>

                    {/* Кнопка */}
                    <View className="mt-8">
                        <TouchableOpacity
                            activeOpacity={0.85}
                            className="bg-emerald-500 py-4 rounded-2xl items-center shadow-md"
                        >
                            <Text className="text-white text-xl font-bold tracking-tight">
                                Створити профіль
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
