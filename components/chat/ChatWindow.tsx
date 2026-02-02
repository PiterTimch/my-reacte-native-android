import { FC, useEffect, useState, useRef } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { getChatConnection } from "@/hubs/chatHub";
import { IMessageItem } from "@/types/chat/IMessageItem";
import { useGetChatMessagesQuery } from "@/services/chatService";

interface ChatWindowProps {
    chatId: number | null;
}

const ChatWindow: FC<ChatWindowProps> = ({ chatId }) => {
    const { data: history } = useGetChatMessagesQuery(chatId ?? 0, {
        skip: !chatId,
    });

    const [messages, setMessages] = useState<IMessageItem[]>([]);
    const [input, setInput] = useState(""); // <- текст, що пише користувач
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        if (history) setMessages(history);
    }, [history]);

    useEffect(() => {
        if (!chatId) return;
        const connection = getChatConnection();
        if (!connection) return;

        connection.invoke("JoinChat", chatId);

        const handler = (msg: IMessageItem) => setMessages(prev => [...prev, msg]);
        connection.on("ReceiveMessage", handler);

        return () => {
            connection.invoke("LeaveChat", chatId);
            connection.off("ReceiveMessage", handler);
            setMessages([]);
        };
    }, [chatId]);

    const sendMessage = () => {
        const trimmed = input.trim();
        if (!trimmed || !chatId) return;

        const connection = getChatConnection();
        if (!connection) return;

        connection.invoke("SendMessage", { chatId, message: trimmed });
        setInput("");
    };

    if (!chatId) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-zinc-400">Оберіть чат</Text>
            </View>
        );
    }

    return (
        <View className="flex-1">
            <ScrollView
                ref={scrollViewRef}
                className="flex-1 p-4"
                contentContainerStyle={{ gap: 8 }}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
                {messages.map((m, index) => (
                    <View
                        key={m.id ? m.id.toString() : index.toString()}
                        className="bg-zinc-200 dark:bg-zinc-800 p-3 rounded-xl self-start max-w-[85%]"
                    >
                        <Text className="text-zinc-900 dark:text-zinc-100">{m.message}</Text>
                    </View>
                ))}
            </ScrollView>

            <View className="flex-row p-2 border-t border-zinc-300 dark:border-zinc-700">
                <TextInput
                    className="flex-1 p-3 bg-zinc-100 dark:bg-zinc-900 rounded-xl text-zinc-900 dark:text-zinc-100"
                    placeholder="Напишіть повідомлення..."
                    placeholderTextColor="#888"
                    value={input}
                    onChangeText={setInput}
                    onSubmitEditing={sendMessage}
                />
                <TouchableOpacity
                    onPress={sendMessage}
                    className="ml-2 bg-emerald-500 p-3 rounded-xl"
                >
                    <Text className="text-white font-semibold">Відправити</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ChatWindow;
