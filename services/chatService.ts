import { createBaseQuery } from "@/utils/createBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import {IChatType} from "@/types/chat/IChatType";
import {IUserShort} from "@/types/chat/IUserShort";
import { IChatCreate } from "@/types/chat/IChatCreate";
import {IChatListItem} from "@/types/chat/IChatListItem";

export const chatService = createApi({
    reducerPath: 'api/chats',
    baseQuery: createBaseQuery('chats'),
    endpoints: builder => ({

        getChatTypes: builder.query<IChatType[], void>({
            query: () => 'types'
        }),

        getUsers: builder.query<IUserShort[], void>({
            query: () => 'users'
        }),

        createChat: builder.mutation<number, IChatCreate>({
            query: body => ({
                url: '',
                method: 'POST',
                body
            })
        }),

        getMyChats: builder.query<IChatListItem[], void>({
            query: () => 'my'
        })
    })
});

export const {
    useGetChatTypesQuery,
    useGetUsersQuery,
    useCreateChatMutation,
    useGetMyChatsQuery
} = chatService;
