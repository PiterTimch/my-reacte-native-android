import { FC } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { IChatListItem } from "@/types/chat/IChatListItem";

interface ChatListProps {
    chats: IChatListItem[];
    activeChatId: number | null;
    onSelect: (id: number) => void;
}

const ChatList: FC<ChatListProps> = ({
                                         chats,
                                         activeChatId,
                                         onSelect,
                                     }) => {
    return (
        <View className="p-3 gap-1">
            {chats.map(chat => {
                const isActive = chat.id === activeChatId;

                return (
                    <TouchableOpacity
                        key={chat.id}
                        onPress={() => onSelect(chat.id)}
                        className={`p-3 rounded-xl
                            ${isActive
                            ? "bg-emerald-500"
                            : "bg-zinc-100 dark:bg-zinc-900"}
                        `}
                    >
                        <Text
                            className={
                                isActive
                                    ? "text-white font-semibold"
                                    : "text-zinc-800 dark:text-zinc-200"
                            }
                        >
                            {chat.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default ChatList;
