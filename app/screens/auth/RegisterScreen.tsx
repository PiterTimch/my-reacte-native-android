import React, { useState } from "react";
import {
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";

export default function RegisterScreen() {
    const [image, setImage] = useState<string | null>(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Доступ до галереї потрібен для вибору фото.");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <View className="flex-1 bg-zinc-50 dark:bg-zinc-950">
            <StatusBar barStyle="default" />

            <LinearGradient
                colors={["rgba(16,185,129,0.35)", "transparent"]}
                className="absolute w-full h-[380px] rounded-full blur-[120px]"
            />

            <SafeAreaView className="flex-1 px-6 py-12">
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View className="items-center mt-4">
                            <Text className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">
                                Реєстрація
                            </Text>
                            <View className="h-[2px] w-12 bg-emerald-500 my-6 rounded-full" />
                            <Text className="text-zinc-500 dark:text-zinc-400 text-center text-lg leading-7 font-medium px-4">
                                Створіть свій профіль, щоб почати використовувати додаток
                            </Text>
                        </View>

                        <View className="items-center my-8">
                            <TouchableOpacity
                                activeOpacity={0.8}
                                className="w-36 h-36 rounded-full bg-emerald-500/10 items-center justify-center"
                                onPress={pickImage}
                            >
                                {image ? (
                                    <Image
                                        source={{ uri: image }}
                                        className="w-36 h-36 rounded-full"
                                    />
                                ) : (
                                    <Text className="text-8xl">🐣</Text>
                                )}
                            </TouchableOpacity>
                            <Text className="text-zinc-400 dark:text-zinc-500 mt-2">
                                Натисніть, щоб обрати фото
                            </Text>
                        </View>

                        <View className="flex-row gap-4 mb-4">
                            <TextInput
                                placeholder="Ім'я"
                                placeholderTextColor="#9ca3af"
                                className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4 py-4 text-zinc-900 dark:text-white text-base"
                            />
                            <TextInput
                                placeholder="Прізвище"
                                placeholderTextColor="#9ca3af"
                                className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4 py-4 text-zinc-900 dark:text-white text-base"
                            />
                        </View>

                        <View className="gap-y-4">
                            <TextInput
                                textContentType="emailAddress"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholder="Пошта"
                                placeholderTextColor="#9ca3af"
                                className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4 py-4 text-zinc-900 dark:text-white text-base"
                            />

                            <View className={"gap-4 mb-4"}>
                                <View className="relative">
                                    <TextInput
                                        placeholder="Пароль"
                                        placeholderTextColor="#9ca3af"
                                        secureTextEntry={!showPassword}
                                        value={password}
                                        onChangeText={setPassword}
                                        className="bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4 py-4 text-zinc-900 dark:text-white text-base"
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-4"
                                    >
                                        <Text className="text-zinc-500 dark:text-zinc-400">
                                            {showPassword ? "Сховати" : "Показати"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <View className="relative">
                                    <TextInput
                                        placeholder="Підтвердьте пароль"
                                        placeholderTextColor="#9ca3af"
                                        secureTextEntry={!showConfirmPassword}
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        className="bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4 py-4 text-zinc-900 dark:text-white text-base"
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-4"
                                    >
                                        <Text className="text-zinc-500 dark:text-zinc-400">
                                            {showConfirmPassword ? "Сховати" : "Показати"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View className="mt-8 mb-4">
                            <TouchableOpacity
                                activeOpacity={0.85}
                                className="bg-emerald-500 py-5 rounded-2xl items-center shadow-md"
                            >
                                <Text className="text-white text-xl font-bold tracking-tight">
                                    Створити профіль
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
