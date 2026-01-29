import {createApi} from "@reduxjs/toolkit/query/react";
import {IAuthResponse} from "@/types/auth/IAuthResponse";
import {IRegister} from "@/types/auth/IRegister";
import {createBaseQuery} from "@/utils/CreateBaaseQuery";
import {ILogin} from "@/types/auth/ILogin";
import {serialize} from "object-to-formdata";

export const authService = createApi({
    reducerPath: 'api/account',
    baseQuery: createBaseQuery('Account'),
    tagTypes: ['Account', 'AccountPassword'],
    endpoints: (builder) => ({
        login: builder.mutation<IAuthResponse, ILogin>({
            query: (credentials) => ({
                url: 'login',
                method: 'POST',
                body: credentials
            })
        }),


        register: builder.mutation<IAuthResponse, IRegister>({
            query: (credentials) => {
                const formData =  serialize(credentials);

                return {
                    url: 'register',
                    method: 'POST',
                    body: formData
                };
            }
        })

    })
});

export const {
    useLoginMutation,
    useRegisterMutation
} = authService;