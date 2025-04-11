import { View, Image } from 'react-native'
import React from 'react'
import { Text } from '~/components/ui/text'
import { Input } from '~/components/ui/input'
import { Feather } from '@expo/vector-icons'
import { useState } from 'react'

const ListHeader = () => {
    const [value, setValue] = useState('');
    const onChangeText = (text: string) => {
        setValue(text);
    };

    return (
        <View
            style={{
                backgroundColor: '#000',
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                paddingTop: 30,
                paddingBottom: 32,
                paddingHorizontal: 16,
                position: 'relative',
            }}
        >

            <Image
                source={require('~/assets/apro/ball-small.png')}
                style={{
                    position: 'absolute',
                    top: 40,
                    right: 82,
                    width: 88,
                    height: 80,
                    zIndex: 0,
                    opacity: 0.2,
                }}
                resizeMode="contain"
            />

            <Image
                source={{ uri: 'https://www.apro.com/assets/ball-big-DL9R8XGi.png' }}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    right: -10,
                    width: 184,
                    height: 150,
                    zIndex: 0,
                    opacity: 0.4,
                }}
                resizeMode="contain"
            />
            <Text className="text-3xl font-extrabold text-white text-center">
                The AI Agent
            </Text>
            <Text className="text-lg text-white/90 text-center mt-1">
                Data Explorer
            </Text>
           
        </View>
    )
}


export default ListHeader