import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    tabBarLabel: 'Home',    
                    tabBarIcon: ({ color, size }) => (  
                        <Ionicons name="home" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    tabBarLabel: 'Search',
                    tabBarIcon: ({ color, size }) => (  
                        <Ionicons name="search" color={color} size={size} />
                    ),
                }}
            />
        </Tabs>

    );
}
