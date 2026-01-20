import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
    return (
        <Tabs initialRouteName={undefined} backBehavior='history'>
            <Tabs.Screen
                name="index"
                options={{
                    tabBarLabel: 'Home',   
                    headerShown: false, 
                    tabBarIcon: ({ color, size }) => (  
                        <Ionicons name="home" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="library"
                options={{
                    tabBarLabel: 'Library',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="library" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    tabBarLabel: 'Search',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (  
                        <Ionicons name="search" color={color} size={size} />
                    ),
                }}
            />
        </Tabs>

    );
}
