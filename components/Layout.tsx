import { SafeAreaView, StatusBar, Text, TouchableHighlight, TouchableOpacity, View } from "react-native"
import { Entypo, Octicons, MaterialIcons } from '@expo/vector-icons';
import { useAtom } from "jotai";
import { tokenAtom, emailAtom, onlineUsersAtom } from "../store";
import { useRoute } from '@react-navigation/native';
import { useEffect } from "react";
import { userBaseURL } from "../env";
import { socket } from "../socket";

const Layout = ({ children, navigation }: { children: React.ReactNode, navigation: any }) => {
    const [token, setToken] = useAtom(tokenAtom);
    const [email, setEmail] = useAtom(emailAtom);
    const [onlineUsers, setOnlineUsers] = useAtom(onlineUsersAtom);
    const route = useRoute();
    // console.log(typeof navigation)
    if (!token) {
        navigation.navigate('Login');
    }

    useEffect(() => {
        const res = onlineUsers.get(email);
        if (!res) {
            socket.connect();
            socket.emit('join', {
                email: email
            })
        }
    }, [onlineUsers])

    useEffect(() => {
        const authenticate = async () => {
            console.log('authenticating')
            const res = await fetch(`${userBaseURL}/authenticate`, {
                method: 'GET',
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();

            if (!data.status) {
                navigation.navigate('Login');
            }
        }

        authenticate();
    }, []);

    const tabOptions = [
        {
            name: "Home",
            icon: <Octicons name="home" size={24} color={route.name === "Home" ? "#0866FF" : "black"} />
        },
        {
            name: "Profile",
            icon: <MaterialIcons name="account-circle" size={24} color={route.name === "Profile" ? "#0866FF" : "black"} />
        }
    ]

    return (
        <View className=" tw-flex-1 tw-justify-between">
            <StatusBar barStyle="dark-content" />
            {children}
            <View className="tw-w-full tw-bgg-black tw-px-[16px] tw-pt-[8px] tw-pb-[25px] tw-border-t-[1px] tw-shadow-lg tw-flex tw-flex-row tw-justify-evenly tw-absolute tw-bottom-0 tw-bg-white">
                {
                    tabOptions.map((e, idx) => {
                        return (
                            <TouchableOpacity className="tw-flex tw-flex-col tw-items-center" key={idx} onPress={() => navigation.navigate(e.name)} >
                                {e.icon}
                                <Text className={`tw-text-[10px] ${route.name === e.name ? "tw-text-[#0866FF]" : "tw-text-black"}`}>{e.name}</Text>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        </View>
    )
}

export default Layout;