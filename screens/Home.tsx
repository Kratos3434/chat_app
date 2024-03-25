import { SafeAreaView, ScrollView, Text } from "react-native"
// import * as SecureStore from 'expo-secure-store';
// import { useAtom } from "jotai";
// import { tokenAtom } from "../store";
import Layout from "../components/Layout";
import { publicBaseURL } from "../env";
import { useQuery } from "@tanstack/react-query";
import PostCard from "../components/PostCard";

const Home = ({ navigation }: { navigation: any }) => {
    // const [token, setToken] = useAtom(tokenAtom);

    // if (!token) {
    //     navigation.navigate('Login');
    // }

    const getAllPosts = async () => {
        const res = await fetch(`${publicBaseURL}/post/list`);
        const data = await res.json();
        return data.data;
    }

    const { data, status } = useQuery({
        queryKey: ['posts'],
        queryFn: getAllPosts,
        staleTime: Infinity
    });

    if (status !== 'success') {
        return (
            <Layout navigation={navigation}>
                <SafeAreaView className="tw-bg-gray-200">
                    <Text>Loading...</Text>
                </SafeAreaView>
            </Layout>
        )
    }

    return (
        <Layout navigation={navigation}>
            <SafeAreaView className="tw-bg-gray-200">
                <ScrollView className="tw-flex tw-flex-col tw-w-full">
                    {
                        data.map((e: any, idx: number) => {
                            return (
                                <PostCard post={e} key={idx} />
                            )
                        })
                    }
                </ScrollView>
            </SafeAreaView>
        </Layout>
    )
}

export default Home;