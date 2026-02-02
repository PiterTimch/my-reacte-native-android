import { FC, useEffect, useState } from "react";
import { View, Text } from "react-native";
import {getChatConnection} from "@/hubs/chatHub";

interface Message {
    userId: number;
    message: string;
    createdAt: string;
}

interface ChatWindowProps {
    chatId: number | null;
}

const ChatWindow: FC<ChatWindowProps> = ({ chatId }) => {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (!chatId) return;

        const connection = getChatConnection();
        if (!connection) return;

        connection.invoke("JoinChat", chatId);

        const handler = (msg: Message) => {
            setMessages(prev => [...prev, msg]);
        };

        connection.on("ReceiveMessage", handler);

        return () => {
            connection.invoke("LeaveChat", chatId);
            connection.off("ReceiveMessage", handler);
            setMessages([]);
        };
    }, [chatId]);

    if (!chatId) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-zinc-400">
                    Оберіть чат
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 p-4 gap-2">
            {messages.map((m, i) => (
                <View
                    key={i}
                    className="bg-zinc-200 dark:bg-zinc-800 p-3 rounded-xl"
                >
                    <Text className="text-zinc-900 dark:text-zinc-100">
                        {m.message}
                    </Text>
                </View>
            ))}
        </View>
    );
};

export default ChatWindow;
