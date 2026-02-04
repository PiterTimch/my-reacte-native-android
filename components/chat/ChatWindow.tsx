import { FC, useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Modal,
} from "react-native";
import { getChatConnection } from "@/hubs/chatHub";
import { IMessageItem } from "@/types/chat/IMessageItem";
import {
    useGetChatMessagesQuery,
    useAmIAdminQuery,
    useEditChatMutation,
} from "@/services/chatService";

interface ChatWindowProps {
    chatId: number | null;
}

const ChatWindow: FC<ChatWindowProps> = ({ chatId }) => {
    const { data: history } = useGetChatMessagesQuery(chatId ?? 0, {
        skip: !chatId,
    });

    const { data: isAdmin } = useAmIAdminQuery(chatId ?? 0, {
        skip: !chatId,
    });

    const [editChat, { isLoading }] = useEditChatMutation();

    const [messages, setMessages] = useState<IMessageItem[]>([]);
    const [input, setInput] = useState("");

    const [editVisible, setEditVisible] = useState(false);
    const [chatName, setChatName] = useState("");

    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        if (history) setMessages(history);
    }, [history]);

    useEffect(() => {
        if (!chatId) return;
        const connection = getChatConnection();
        if (!connection) return;

        connection.invoke("JoinChat", chatId);

        const handler = (msg: IMessageItem) =>
            setMessages(prev => [...prev, msg]);

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

    const openEdit = () => {
        setChatName("");
        setEditVisible(true);
    };

    const saveEdit = async () => {
        if (!chatId || !chatName.trim()) return;

        await editChat({
            id: chatId,
            name: chatName.trim(),
        });

        setEditVisible(false);
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
            {/* HEADER */}
            <View className="flex-row items-center justify-between p-3 border-b border-zinc-300 dark:border-zinc-700">
                <Text className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    Чат
                </Text>

                {isAdmin && (
                    <TouchableOpacity
                        onPress={openEdit}
                        className="px-3 py-1 bg-emerald-500 rounded-lg"
                    >
                        <Text className="text-white font-semibold">
                            Редагувати
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* MESSAGES */}
            <ScrollView
                ref={scrollViewRef}
                className="flex-1 p-4"
                contentContainerStyle={{ gap: 8 }}
                onContentSizeChange={() =>
                    scrollViewRef.current?.scrollToEnd({ animated: true })
                }
            >
                {messages.map((m, index) => (
                    <View
                        key={m.id ? m.id.toString() : index.toString()}
                        className="bg-zinc-200 dark:bg-zinc-800 p-3 rounded-xl self-start max-w-[85%]"
                    >
                        <Text className="text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                            {m.userName || "Інший користувач"}
                        </Text>
                        <Text className="text-zinc-900 dark:text-zinc-100">
                            {m.message}
                        </Text>
                    </View>
                ))}
            </ScrollView>

            {/* INPUT */}
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
                    <Text className="text-white font-semibold">
                        Відправити
                    </Text>
                </TouchableOpacity>
            </View>

            {/* EDIT MODAL */}
            <Modal
                visible={editVisible}
                transparent
                animationType="fade"
            >
                <View className="flex-1 bg-black/50 items-center justify-center">
                    <View className="w-[90%] bg-white dark:bg-zinc-900 rounded-xl p-4">
                        <Text className="text-lg font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
                            Редагувати чат
                        </Text>

                        <TextInput
                            value={chatName}
                            onChangeText={setChatName}
                            placeholder="Назва чату"
                            placeholderTextColor="#888"
                            className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 mb-4"
                        />

                        <View className="flex-row justify-end gap-3">
                            <TouchableOpacity
                                onPress={() => setEditVisible(false)}
                            >
                                <Text className="text-zinc-500">
                                    Скасувати
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={saveEdit}
                                disabled={isLoading}
                            >
                                <Text className="text-emerald-500 font-semibold">
                                    Зберегти
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ChatWindow;
