import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import React from 'react';
import { Text } from '~/components/ui/text';
import * as Clipboard from 'expo-clipboard';
import {convertToTimeAgo, openTxHashInBrowser} from "~/utils/utils";
import { Feather } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Toast } from 'toastify-react-native';

import { router } from 'expo-router';
import Bsc from '~/lib/svg/Bsc';
import Default from '~/lib/svg/Default';
import Apro from '~/lib/svg/Apro';

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

const LatestSourceAgent = ({
  data,
  loading,
}: {
  data: SourceAgent[];
  loading: boolean;
}) => {
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

  return (
    <View className="px-4 pt-4">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <FontAwesome6 name="robot" size={20} color="#32CD32" />
          <Text className="text-xl font-bold text-neutral-800 dark:text-white ml-2">
            Latest Source Agent
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/source_agent')}>
          <Text className="text-sm font-semibold text-green-600 dark:text-green-400">
            View More
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        data.map((agent, index) => (
          <TouchableOpacity
            key={index}
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
            <View
              className="bg-white dark:bg-neutral-900 p-4 mb-4 rounded-2xl"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
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
                    {agent.name.toLowerCase().includes('apro') ? (
                      <Apro />
                    ) : (
                      <Default />
                    )}
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
              <Row
                label="Pass Percentage"
                value={`${agent.passPercentage.toFixed(2)}%`}
              />
              <StatusRow status={agent.status} />
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <View className="flex-row justify-between items-center mb-1">
    <Text className="text-gray-500 dark:text-gray-400 text-sm">{label}</Text>
    {typeof value === 'string' ? (
      <Text className="text-sm font-semibold text-gray-800 dark:text-white">
        {value}
      </Text>
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
  const openExplorer = async () => {
    await openTxHashInBrowser(fullValue);
  };

  const isTxHash = label === 'TX Hash';

  return (
    <View className="flex-row justify-between items-center mb-1">
      <Text className="text-gray-500 dark:text-gray-400 text-sm">{label}</Text>
      <View className="flex-row items-center">
        {isTxHash ? (
          <TouchableOpacity onPress={openExplorer}>
            <Text className="text-sm font-semibold text-blue-600 dark:text-blue-400 mr-2 underline">
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
        className={`text-sm font-semibold ${
          isActive ? 'text-green-600 dark:text-green-400' : 'text-red-500'
        }`}
      >
        {status.toUpperCase()}
      </Text>
    </View>
  );
};

export default LatestSourceAgent;
