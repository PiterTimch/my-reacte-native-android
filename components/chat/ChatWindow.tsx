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
    useGetUsersQuery,
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

    const [addUserIds, setAddUserIds] = useState<number[]>([]);
    const [removeUserIds, setRemoveUserIds] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

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
        setAddUserIds([]);
        setRemoveUserIds([]);
        setSearchQuery("");
        setEditVisible(true);
    };

    const saveEdit = async () => {
        if (!chatId) return;

        await editChat({
            id: chatId,
            name: chatName.trim() || undefined,
            addUserIds,
            removeUserIds,
        });

        setEditVisible(false);
        setAddUserIds([]);
        setRemoveUserIds([]);
        setSearchQuery("");
    };

    const { data: members } = useGetUsersQuery(
        { chatId: chatId! },
        { skip: !editVisible || !chatId }
    );

    const { data: searchUsers } = useGetUsersQuery(
        { query: searchQuery },
        { skip: !editVisible || searchQuery.length < 2 }
    );

    const toggleAdd = (id: number) => {
        setAddUserIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const toggleRemove = (id: number) => {
        setRemoveUserIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
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
            <View className="flex-row items-center justify-between p-3 border-b border-zinc-300 dark:border-zinc-700">
                <Text className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    Чат
                </Text>

                {isAdmin && (
                    <TouchableOpacity
                        onPress={openEdit}
                        className="px-3 py-1 bg-emerald-500 rounded-lg"
                    >
                        <Text className="text-white font-semibold">Редагувати</Text>
                    </TouchableOpacity>
                )}
            </View>

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

            <Modal visible={editVisible} transparent animationType="fade">
                <View className="flex-1 bg-black/50 items-center justify-center">
                    <ScrollView className="w-[90%] bg-white dark:bg-zinc-900 rounded-xl p-4">

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

                        <Text className="font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                            Поточні учасники:
                        </Text>
                        {members?.map(u => (
                            <View
                                key={u.id}
                                className="flex-row justify-between items-center bg-zinc-200 dark:bg-zinc-800 p-2 rounded-lg mb-1"
                            >
                                <Text className="text-zinc-900 dark:text-zinc-100">{u.name}</Text>
                                <TouchableOpacity onPress={() => toggleRemove(u.id)}>
                                    <Text
                                        className={`font-semibold ${
                                            removeUserIds.includes(u.id) ? "text-red-500" : "text-emerald-500"
                                        }`}
                                    >
                                        {removeUserIds.includes(u.id) ? "Видалено" : "Видалити"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))}

                        <TextInput
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Пошук користувачів по імені"
                            placeholderTextColor="#888"
                            className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 mb-2"
                        />

                        {searchUsers?.map(u => (
                            <TouchableOpacity
                                key={u.id}
                                onPress={() => toggleAdd(u.id)}
                                className="flex-row justify-between items-center bg-zinc-200 dark:bg-zinc-800 p-2 rounded-lg mb-1"
                            >
                                <Text className="text-zinc-900 dark:text-zinc-100">{u.name}</Text>
                                <Text
                                    className={`font-semibold ${
                                        addUserIds.includes(u.id) ? "text-emerald-500" : "text-zinc-500"
                                    }`}
                                >
                                    {addUserIds.includes(u.id) ? "Додано" : "Додати"}
                                </Text>
                            </TouchableOpacity>
                        ))}

                        <View className="flex-row justify-end gap-3 mt-3">
                            <TouchableOpacity onPress={() => setEditVisible(false)}>
                                <Text className="text-zinc-500">Скасувати</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={saveEdit} disabled={isLoading}>
                                <Text className="text-emerald-500 font-semibold">Зберегти</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
};

export default ChatWindow;
