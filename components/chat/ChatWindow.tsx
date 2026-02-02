import { FC, useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { getChatConnection } from "@/hubs/chatHub";
import { IMessageItem } from "@/types/chat/IMessageItem";
import { useGetChatMessagesQuery } from "@/services/chatService";

interface ChatWindowProps {
    chatId: number | null;
}

const ChatWindow: FC<ChatWindowProps> = ({ chatId }) => {
    // 1. Отримуємо історію повідомлень (skip: !chatId зупиняє запит, якщо id порожній)
    const { data: history, isLoading } = useGetChatMessagesQuery(chatId ?? 0, {
        skip: !chatId,
    });

    const [messages, setMessages] = useState<IMessageItem[]>([]);

    // 2. Синхронізуємо локальний стейт з отриманою історією
    useEffect(() => {
        if (history) {
            setMessages(history);
        }
    }, [history]);

    // 3. SignalR для нових повідомлень
    useEffect(() => {
        if (!chatId) return;

        const connection = getChatConnection();
        if (!connection) return;

        // Приєднуємось до групи чату
        connection.invoke("JoinChat", chatId);

        const handler = (msg: IMessageItem) => {
            // Додаємо нове повідомлення в кінець списку
            setMessages(prev => [...prev, msg]);
        };

        connection.on("ReceiveMessage", handler);

        return () => {
            connection.invoke("LeaveChat", chatId);
            connection.off("ReceiveMessage", handler);
            // Очищуємо стейт при зміні чату, щоб не бачити повідомлення попереднього
            setMessages([]);
        };
    }, [chatId]);

    if (!chatId) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-zinc-400">Оберіть чат</Text>
            </View>
        );
    }

    if (isLoading && messages.length === 0) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-zinc-400">Завантаження повідомлень...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1">
            <ScrollView
                className="flex-1 p-4"
                contentContainerStyle={{ gap: 8 }}
            >
                {messages.map((m, index) => (
                    <View
                        key={m.id ? m.id.toString() : index.toString()}
                        className="bg-zinc-200 dark:bg-zinc-800 p-3 rounded-xl self-start max-w-[85%]"
                    >
                        <Text className="text-zinc-900 dark:text-zinc-100">
                            {m.message}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default ChatWindow;