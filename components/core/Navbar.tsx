import { View, Image, TouchableOpacity } from 'react-native'
import { Text } from "~/components/ui/text";
import React from 'react'

import Apro from '~/lib/svg/Apro';
import { ThemeToggle } from '~/components/ThemeToggle';
const Navbar = () => {

    return (
        <View className="flex-row justify-between items-center px-4 py-3">
            <View className="flex-row items-center">
                <Apro />
                <View className="flex-row ml-3">
                    <Text className="text-2xl font-bold">APRO</Text>
                    <Text className="text-sm font-medium  ml-1 mt-2">Explorer</Text>
                </View>
            </View>


            <View className="flex-row items-center">
                <ThemeToggle />
            </View>
        </View>
    )
}

export default Navbar