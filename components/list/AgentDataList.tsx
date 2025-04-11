import { View, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import React from 'react';
import { Text } from '~/components/ui/text';
import * as Clipboard from 'expo-clipboard';
import { Feather } from '@expo/vector-icons';
import { Toast } from 'toastify-react-native';

import {convertToTimeAgo, openTxHashInBrowser} from "~/utils/utils";
import { router } from 'expo-router';
import Bsc from '~/lib/svg/Bsc';
import Default from '~/lib/svg/Default';
import Apro from '~/lib/svg/Apro';
import ListHeader from '../home/ListHeader';

type SourceAgent = {
    sourceAgent: string;
    name: string;
    chain: string;
    txHash: string;
    age: number;
    sendVolume: number;
    passPercentage: number;
    configDigest: string;
    status: string;
};

type Props = {
    data: SourceAgent[];
    loading: boolean;
    refreshing: boolean;
    onLoadMore: () => void;
    onRefresh: () => void;
};

const SourceAgentList = ({ data, loading, refreshing, onLoadMore, onRefresh }: Props) => {

    const copyToClipboard = async (content: string) => {
        await Clipboard.setStringAsync(content);
        Toast.show({
            type: 'success',
            text1: 'Copied to clipboard',
            position: 'top',
            visibilityTime: 1000,
        });
    };

    const truncate = (val: string, start = 6, end = 6) =>
        `${val.slice(0, start)}******${val.slice(-end)}`;

    const renderItem = ({ item: agent }: { item: SourceAgent }) => (
        <TouchableOpacity
            onPress={() =>
                router.navigate({
                    pathname: '/(detail)/agent',
                    params: {
                        agentId: String(agent.sourceAgent),
                        configDigest: String(agent.configDigest),
                    },
                })
            }
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
            }}
        >
            <View className="px-4 pt-4">
                <View className="bg-white dark:bg-neutral-900 p-4 mb-4 rounded-2xl">
                    <CopyableRow
                        label="Source Agent ID"
                        value={truncate(agent.sourceAgent)}
                        fullValue={agent.sourceAgent}
                        onCopy={copyToClipboard}
                    />
                    <Row
                        label="Name"
                        value={
                            <View className="flex-row items-center">
                                {agent.name.toLowerCase().includes('apro') ? <Apro /> : <Default />}
                                <Text className="ml-2 text-sm font-semibold text-gray-800 dark:text-white">
                                    {agent.name}
                                </Text>
                            </View>
                        }
                    />
                    <Row
                        label="Chain"
                        value={
                            <View className="flex-row items-center">
                                <Bsc />
                                <Text className="ml-2 text-sm font-semibold text-gray-800 dark:text-white">
                                    {agent.chain}
                                </Text>
                            </View>
                        }
                    />
                    <CopyableRow
                        label="TX Hash"
                        value={truncate(agent.txHash)}
                        fullValue={agent.txHash}
                        onCopy={copyToClipboard}
                    />
                    <Row label="Age" value={convertToTimeAgo(agent.age)} />
                    <Row label="Transfer Volume" value={`${agent.sendVolume}`} />
                    <Row label="Pass Percentage" value={`${agent.passPercentage.toFixed(2)}%`} />
                    <StatusRow status={agent.status} />
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View>

            <FlatList
                data={data}
                keyExtractor={(item, index) => `${item.sourceAgent}-${index}`}
                renderItem={renderItem}
                onEndReached={onLoadMore}
                onEndReachedThreshold={0.5}
                onRefresh={onRefresh}
                refreshing={refreshing}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => (
                    <ListHeader />
                )}
                ListFooterComponent={
                    loading ? (
                        <ActivityIndicator size="large" color="#4CAF50" className="my-6" />
                    ) : null
                }
                contentContainerStyle={{ paddingBottom: 80 }}
            />

        </View>
    );
};

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <View className="flex-row justify-between items-center mb-1">
        <Text className="text-gray-500 dark:text-gray-400 text-sm">{label}</Text>
        {typeof value === 'string' ? (
            <Text className="text-sm font-semibold text-gray-800 dark:text-white">{value}</Text>
        ) : (
            value
        )}
    </View>
);

const CopyableRow = ({
    label,
    value,
    fullValue,
    onCopy,
}: {
    label: string;
    value: string;
    fullValue: string;
    onCopy: (val: string) => void;
}) => {
    const isTxHash = label.toLowerCase() === 'tx hash';

    return (
        <View className="flex-row justify-between items-center mb-1">
            <Text className="text-gray-500 dark:text-gray-400 text-sm">{label}</Text>
            <View className="flex-row items-center">
                {isTxHash ? (
                    <TouchableOpacity
                        onPress={() =>
                             openTxHashInBrowser(fullValue)
                        }
                    >
                        <Text className="text-sm font-semibold text-blue-600 dark:text-blue-400 underline mr-2">
                            {value}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <Text className="text-sm font-semibold text-gray-800 dark:text-white mr-2">
                        {value}
                    </Text>
                )}
                <TouchableOpacity onPress={() => onCopy(fullValue)}>
                    <Feather name="copy" size={16} color="#32CD32" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const StatusRow = ({ status }: { status: string }) => {
    const isActive = status.toLowerCase() === 'active';
    return (
        <View className="flex-row justify-between items-center mt-1">
            <Text className="text-gray-500 dark:text-gray-400 text-sm">Status</Text>
            <Text
                className={`text-sm font-semibold ${isActive ? 'text-green-600 dark:text-green-400' : 'text-red-500'
                    }`}
            >
                {status.toUpperCase()}
            </Text>
        </View>
    );
};

export default SourceAgentList;
