import { Stack, Redirect } from "expo-router";
import { useAppSelector } from "@/store";

export default function ChatLayout() {
    const { user } = useAppSelector(state => state.auth);

    if (!user) {
        return <Redirect href="/" />;
    }

    return <Stack screenOptions={{ headerShown: false }} />;
}
