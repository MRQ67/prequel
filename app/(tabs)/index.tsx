import { useTheme } from "@/lib/contexts/ThemeContext";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
    const { colors } = useTheme();

    return (
        <SafeAreaView
            className="flex-1"
            style={{ backgroundColor: colors.background }}
        >
            <View className="flex-1 px-3" style={{ backgroundColor: colors.background }}>
                <Text
                    className="text-2xl font-bold mb-4"
                    style={{ color: colors.foreground }}
                >
                    Prequel
                </Text>
            </View>
        </SafeAreaView>
    );
}