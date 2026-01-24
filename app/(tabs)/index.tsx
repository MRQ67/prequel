import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
    return (
        <SafeAreaView className="bg-white flex-1">
            <View className="flex-1 px-3 pt-10">
                <Text className="text-2xl font-bold mb-4">Prequel</Text>
            </View>
        </SafeAreaView>
    );
}