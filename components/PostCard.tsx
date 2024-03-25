import { Image, Text, View } from "react-native";
import { PostProps } from "../types";
import { generateDate } from "../helpers";
import { Feather, AntDesign } from '@expo/vector-icons';
import Video from 'react-native-video';
import { Dimensions } from "react-native";

const PostCard = ({ post }: { post: PostProps }) => {
    const { width } = Dimensions.get("window");

    return (
        <View className="tw-w-full tw-bg-white tw-flex-col tw-flex tw-my-[4px]">
            <View className="tw-flex tw-flex-col tw-px-[16px] tw-pt-[12px]">
                <View className="tw-flex tw-gap-2 tw-items-center tw-flex-row">
                    <Image source={{ uri: post.author.profilePicture }} width={40} height={40} className="tw-rounded-[1000px]" />
                    <View className="tw-flex tw-justify-between tw-flex-1 tw-flex-row">
                        <View className="tw-flex tw-flex-col">
                            <Text className="tw-text tw-font-bold tw-whitespace-nowrap">
                                {post.author.firstName} {post.author.lastName}
                            </Text>
                            <Text className="tw-text-[13px] tw-text-[#65676B]">
                                {generateDate(post.createdAt)}
                            </Text>
                        </View>
                        <View className="tw-flex tw-flex-row tw-gap-4 tw-relative">
                            <Feather name="more-horizontal" size={24} color="black" />
                            <AntDesign name="close" size={24} color="black" />
                        </View>
                    </View>
                </View>
                <Text className="tw-text-[15px] tw-py-2">
                    {post.description}
                </Text>
            </View>
            {
                post.featureImage &&
                (
                    // post.featureImage.substring(post.featureImage.lastIndexOf('.')) === '.mp4' ?
                    // (
                    //     <Video source={{uri: post.featureImage}} />
                    // ):
                    // (
                    //     <Image source={{uri: post.featureImage}} width={680} height={680} className="tw-w-full" />
                    // )
                    post.featureImage.substring(post.featureImage.lastIndexOf('.')) !== '.mp4' &&
                    (
                        <View className="tw-w-full">
                            <Image source={{ uri: post.featureImage }} style={{ flex: 1, aspectRatio: 1.1, height: null }} resizeMode="contain" />
                        </View>
                    )
                )
            }
        </View>
    )
}

export default PostCard;