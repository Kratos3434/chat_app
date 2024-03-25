import { View } from "react-native";

const MyModal = ({ children }: { children: React.ReactNode }) => {
    return (
        <View className="tw-absolute tw-h-full tw-w-full tw-z-[10000] tw-py-5 tw-px-[16px] tw-bg-[rgb(0,0,0)] tw-bg-[rgba(0,0,0,0.4)] tw-justify-center tw-items-center">
            {children}
        </View>
    )
}

export default MyModal;