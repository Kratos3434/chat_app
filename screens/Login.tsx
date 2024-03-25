
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useState, useRef } from "react";
import { Entypo } from '@expo/vector-icons';
import MyModal from "../components/MyModal";
import { publicBaseURL } from "../env";
import * as SecureStore from 'expo-secure-store';
import { useAtom } from "jotai";
import { onlineAtom, tokenAtom } from "../store";
import { socket } from "../socket";
import { useQueryClient } from "@tanstack/react-query";

const Login = ({ navigation }: { navigation: any }) => {
    const queryClient = useQueryClient();
    const [showPass, setShowPass] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, isLoading] = useState(false);
    const passwordRef: any = useRef(null);
    const [online, isOnline] = useAtom(onlineAtom);
    const [t, setToken] = useAtom(tokenAtom);

    const handleLogin = async () => {
        if (!email) {
            setError("Email is required");
            return false;
        }

        if (!password) {
            setError("Password is required");
            return false;
        }
        isLoading(true);
        try {
            const res = await fetch(`${publicBaseURL}/signin`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            const cookieToken = res.headers.get('set-cookie');
            const token = cookieToken?.substring(cookieToken.indexOf('=') + 1, cookieToken.indexOf(';'));
            if (data.status) {
                if (token) {
                    await SecureStore.setItemAsync('token', token);
                    await SecureStore.setItemAsync('email', data.data.email);
                    socket.connect();
                    isOnline(true);
                    socket.emit('join', {
                        email: data.data.email
                    });
                    setToken(token);
                }
                queryClient.invalidateQueries({
                    queryKey: ['user'],
                    refetchType: 'all'
                }).then(() => navigation.navigate('Home'));
            } else {
                setError(data.error);
                isLoading(false);
            }
        } catch (err) {
            setError("Something went wrong :(");
            console.log(err)
            isLoading(false);
        }
    }
    return (
        <SafeAreaView>
            {
                loading &&
                <MyModal>
                    <ActivityIndicator size="large" color="white" className="tw-w-[70px] tw-h-[70px]" />
                    <Text className="tw-text-white tw-font-bold">Loading, please wait...</Text>
                </MyModal>
            }
            <ScrollView contentContainerStyle={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                <KeyboardAvoidingView className="tw-items-center" behavior="padding" keyboardVerticalOffset={64}>
                    <View className="tw-flex tw-flex-col tw-justify-center login-xl:tw-text-start tw-text-center tw-my-10">
                        <Text className="tw-text-[#0866FF] sm:tw-text-[60px] tw-text-[50px] tw-font-bold">
                            faceClam Chat
                        </Text>
                    </View>

                    <View className="tw-bg-white tw-rounded-xl tw-p-5 tw-w-full tw-shadow-md">
                        {/** Form */}
                        <View className="tw-gap-3 tw-items-center">
                            <TextInput keyboardType="email-address" placeholder="Email" className="tw-w-full tw-px-[16px] tw-py-[14px] tw-rounded tw-border-2 tw-border-[#DDDFE2] tw-outline-none focus:tw-border-[#0866FF]" placeholderTextColor="black"
                                onChangeText={setEmail} returnKeyType="next" onEndEditing={() => passwordRef.current?.focus()} />
                            <View className="tw-flex tw-justify-between tw-w-full tw-px-[16px] tw-py-[14px] tw-rounded tw-border-2 tw-border-[#DDDFE2] tw-items-center focus:tw-border-[#0866FF] tw-flex-row">
                                <TextInput placeholder="Password" className="tw-outline-none tw-flex tw-flex-row tw-flex-1" placeholderTextColor="black" secureTextEntry={!showPass} onChangeText={setPassword} ref={passwordRef}
                                    onEndEditing={handleLogin} />
                                {
                                    showPass ?
                                        (
                                            <TouchableOpacity onPress={() => setShowPass(false)}>
                                                <Entypo name="eye" size={16} color="black" />
                                            </TouchableOpacity>
                                        ) :
                                        (
                                            <TouchableOpacity onPress={() => setShowPass(true)}>
                                                <Entypo name="eye-with-line" size={16} color="black" />
                                            </TouchableOpacity>
                                        )
                                }
                            </View>
                            {error && <Text className="tw-text-[#FF0000]">*{error}</Text>}
                            <TouchableOpacity className="tw-flex tw-justify-center tw-w-full tw-bg-[#1877F2] tw-rounded tw-text-white tw-cursor-pointer tw-h-[48px] tw-items-center tw-flex-row" onPress={handleLogin}>
                                <Text className="tw-text-[22px] tw-text-white">Log In</Text>
                            </TouchableOpacity>
                        </View>
                        {/* <Link href="/identify/" className="tw-text-center tw-text-[14px] tw-text-[#2989F4] hover:tw-underline tw-my-5" push>
                            <Text>Forgot password?</Text>
                        </Link> */}
                        <View
                            style={{
                                borderBottomColor: 'black',
                                borderBottomWidth: StyleSheet.hairlineWidth,
                            }}
                        />
                        <View className="tw-flex tw-justify-center tw-text-center tw-flex-row tw-mt-5">
                            <TouchableOpacity className="tw-text-white tw-rounded tw-bg-[#42B72A] tw-text-center  tw-px-[16px] tw-py-3 tw-cursor-pointer">
                                <Text className="tw-text-[19px] tw-text-white">Create new account</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Login;