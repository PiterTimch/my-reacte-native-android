import { Text, View, StatusBar, SafeAreaView } from "react-native";

export default function Index() {
    return (
        <View className="flex-1 bg-zinc-50 dark:bg-zinc-950">
            <StatusBar barStyle="default" />

            <View className="absolute top-[-100] right-[-100] w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px]" />
            <View className="absolute bottom-[20%] left-[-50] w-[250px] h-[250px] bg-emerald-600/10 rounded-full blur-[80px]" />

            <SafeAreaView className="flex-1 px-8 justify-between py-16">
                <View className="items-center mt-10">
                    <View className="bg-emerald-500/10 px-4 py-1 rounded-full mb-4 border border-emerald-500/20">
                        <Text className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold tracking-[3px] uppercase">
                            Premium App
                        </Text>
                    </View>

                    <Text className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">
                        Green<Text className="text-emerald-500">Mind</Text>
                    </Text>

                    <View className="h-[2px] w-12 bg-emerald-500 my-6 rounded-full" />

                    <Text className="text-zinc-500 dark:text-zinc-400 text-center text-lg leading-7 font-medium px-4">
                        Твій простір для продуктивності у зеленому стилі.
                    </Text>
                </View>

                <View className="w-full gap-y-6">

                    <View className="relative">
                        <View className="absolute top-1 left-0 right-0 bottom-[-4] bg-emerald-700 rounded-2xl" />

                            <Text className="text-white text-xl font-bold tracking-tight">
                                Увійти до аккаунту
                            </Text>
                    </View>


                        <Text className="text-zinc-900 dark:text-zinc-100 text-lg font-semibold">
                            Створити профіль
                        </Text>

                    <View className="items-center mt-2">
                        <Text className="text-zinc-400 text-sm">Вперше тут? <Text className="text-emerald-500 font-bold">Ознайомитись</Text></Text>
                    </View>
                </View>

            </SafeAreaView>
        </View>
    );
}
