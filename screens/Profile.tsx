import Layout from "../components/Layout";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Fontisto } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { userBaseURL } from "../env";
import { useQuery } from "@tanstack/react-query";
import { generateDate } from "../helpers";
import { useAtom } from "jotai";
import { onlineAtom, onlineUsersAtom } from "../store";
import { useEffect, useState } from "react";

const Profile = ({ navigation }: { navigation: any }) => {
    const [onlineUsers, setOnlineUsers] = useAtom(onlineUsersAtom);
    const [online, setOnline] = useState("");

    useEffect(() => {
        SecureStore.getItemAsync('email').then((e) => {
            if (e) {
                const res = onlineUsers.get(e);
                console.log(onlineUsers)
                if (res) {
                    setOnline(res);
                }
            }
        })
    }, [onlineUsers]);

    const getCurrentUser = async () => {
        console.log('getting user...')
        const res = await fetch(`${userBaseURL}/current`, {
            method: 'GET',
            headers: {
                "Content-Type": 'application/json',
                "Authorization": `Bearer ${await SecureStore.getItemAsync('token')}`
            }
        });
        const data = await res.json();
        return data.data;
    }

    const { data, status } = useQuery({
        queryKey: ['user'],
        queryFn: getCurrentUser,
        staleTime: Infinity,
        // notifyOnChangeProps
    });

    if (status !== 'success') {
        return (
            <Layout navigation={navigation}>
                <Text className="tw-text-white">Loading...</Text>
            </Layout>
        )
    }

    return (
        <Layout navigation={navigation}>
            <View>
                <View className="tw-bg-green-400 tw-h-[150px] tw-px-[16px] tw-items-center tw-justify-center">
                    <View className="tw-flex tw-flex-row tw-justify-end tw-w-full">
                        <TouchableOpacity className="tw-rounded-[50%] tw-bg-gray-600 tw-p-2 tw-items-center tw-justify-center" onPress={() => navigation.push('Settings')}>
                            <Fontisto name="player-settings" size={18} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
                {/* <ScrollView className="tw-px-[16px]">
                <View className="tw-absolute tw-w-[40px] tw-h-[40px] tw-bg-red-500">

                </View>
            </ScrollView> */}
                <View className="tw-px-[16px]">
                    <View className="tw-absolute tw-w-[80px] tw-h-[80px] tw-top-[-40px]">
                        <Image source={{ uri: data.profilePicture }} className="tw-w-[80px] tw-h-[80px] tw-bgg-red-500 tw-mx-[16px] tw-rounded-[1000px] tw-border-[5px]" />
                        <View className={`tw-absolute ${online ? "tw-bg-green-400" : "tw-bg-red-600"} tw-right-[-15px] tw-bottom-[5px] tw-p-2 tw-rounded-[50%] tw-border-[3px]`}>

                        </View>
                    </View>
                    <View className="tw-pt-[50px] tw-gap-5">
                        <View className="tw-rounded-lg tw-bg-gray-600 tw-p-3">
                            <Text className="tw-text-white tw-font-bold tw-text-[20px]">
                                {data.firstName} {data.lastName}
                            </Text>
                        </View>
                        <View className="tw-rounded-lg tw-bg-gray-600 tw-p-3 tw-gap-1">
                            <Text className=" tw-text-gray-300">faceClam Member Since</Text>
                            <Text className="tw-text-white tw-font-semibold">{generateDate(data.createdAt)}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </Layout>
    )
}

export default Profile;