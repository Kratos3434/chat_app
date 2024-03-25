import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Entypo } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useAtom } from "jotai";
import { tokenAtom } from "../store";
import { socket } from "../socket";

const Settings = ({ navigation }: { navigation: any }) => {
    const [token, setToken] = useAtom(tokenAtom);

    const handleLogout = async () => {
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('email');
        socket.disconnect();
        setToken("");
    }

    return (
        <ScrollView className="tw-px-[16px] tw-py-[12px]">
            <TouchableOpacity className="tw-flex tw-rounded-lg tw-flex-row tw-p-3 tw-bg-gray-500 tw-items-center"
                onPress={handleLogout}>
                <Entypo name="log-out" size={25} color="white" />
                <Text className="tw-font-bold tw-text-red-400 tw-px-[10px]">Log Out</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default Settings;