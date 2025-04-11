import { View } from 'react-native'
import React from 'react'
import { Text } from '~/components/ui/text'
import { Feather } from '@expo/vector-icons'

type CardStatProps = {
    overview: any;
};
const CardStat = ({ overview }: CardStatProps) => {
    if (!overview) return null;
    const cardData = overview
        ? [
            {
                title: 'Source Agent',
                subtitle: 'Number of registered Source agents',
                value: `${overview.sourceAgent.count}`,
                icon: 'users',
            },
            {
                title: 'Data Transfer',
                subtitle: 'Number of transaction data messages sent by Source agents',
                value: `${overview.sourceAgent.volume.toLocaleString()}`,
                icon: 'upload',
            },
            {
                title: 'Verification (Total)',
                subtitle: 'Number of agent messages successfully validated by Validators',
                value: `${overview.verificationData.volume.toLocaleString()}`,
                icon: 'check-circle',
            },
            {
                title: 'Validators',
                subtitle: 'Number of Validators used to validate messages sent by Agents',
                value: `${overview.verificationData.count}`,
                icon: 'shield',
            },
        ]
        : [];

    return (
        <View className="flex-row flex-wrap justify-between px-4 pt-6">
            {cardData.map((item, index) => (
                <View
                    key={index}
                    className="w-[48%] bg-white dark:bg-neutral-900  p-4 mb-4"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 3,
                    }}
                >
                    <View className="flex-row items-center gap-3">
                        {/* Left icon circle */}
                        <View className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 items-center justify-center">
                            <Feather name={item.icon as any} size={20} color="#32CD32" />
                        </View>

                        {/* Right side content */}
                        <View className="flex-1">
                            <Text className="text-sm font-semibold text-neutral-800 dark:text-white">
                                {item.title}
                            </Text>
                            <Text
                                className="text-xl font-extrabold text-green-600 dark:text-green-400 mt-1"
                                numberOfLines={1}
                            >
                                {item.value}
                            </Text>

                        </View>
                    </View>
                </View>
            ))}
        </View>
    )
}

export default CardStat