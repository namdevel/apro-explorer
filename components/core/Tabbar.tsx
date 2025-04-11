import React from 'react'
import { Tabs } from "expo-router";
import { useColorScheme } from "~/lib/useColorScheme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import * as WebBrowser from 'expo-web-browser';
const Tabbar = () => {
    const { isDarkColorScheme } = useColorScheme();
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: isDarkColorScheme ? "#fff" : "#000",
            tabBarInactiveTintColor: isDarkColorScheme ? "#32CD32" : "#000",
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    headerShown: false,
                    title: 'Home',
                    tabBarIcon: ({ color }: { color: string }) => <FontAwesome size={20} name="home" color={color} />,
                }}
            />
            <Tabs.Screen
                name="data_message"
                options={{
                    headerShown: false,
                    title: 'Data Message',
                    tabBarIcon: ({ color }: { color: string }) => <FontAwesome6 size={20} name="message" color={color} />,
                }}
            />
            <Tabs.Screen
                name="source_agent"
                options={{
                    headerShown: false,
                    title: 'Source Agent',
                    tabBarIcon: ({ color }: { color: string }) => <FontAwesome6 size={20} name="robot" color={color} />,
                }}
            />

            <Tabs.Screen
                name="docs"
                options={{
                    headerShown: false,
                    title: 'Docs',
                    tabBarIcon: ({ color }: { color: string }) => <FontAwesome size={20} name="book" color={color} />,
                }}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault(); // Stop navigating to the screen
                        WebBrowser.openBrowserAsync('https://docs.apro.com/attps');
                    },
                }}
            />
        </Tabs>
    )
}

export default Tabbar