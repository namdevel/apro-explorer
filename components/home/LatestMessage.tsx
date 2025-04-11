import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import React from 'react';
import { Text } from '~/components/ui/text';
import * as Clipboard from 'expo-clipboard';
import { Feather } from '@expo/vector-icons';
import { Toast } from 'toastify-react-native';
import {convertToTimeAgo, openTxHashInBrowser} from "~/utils/utils";
import Bsc from '~/lib/svg/Bsc';
import { useRouter } from 'expo-router';

type Transaction = {
  dataHash: string;
  chain: string;
  txHash: string;
  age: number;
  sourceAgentId: string;
  sourceAgent: string;
  status: string;
  verificationContract: string;
  configDigest: string;
  agentVersion: number;
  payload: object;
};

const LatestMessage = ({
  data,
  loading,
}: {
  data: Transaction[];
  loading: boolean;
}) => {
  const router = useRouter();

  const copyToClipboard = async (content: string) => {
    await Clipboard.setStringAsync(content);
    Toast.show({
      type: 'success',
      text1: 'Copied to clipboard',
      position: 'top',
      visibilityTime: 1000,
      autoHide: true,
      iconColor: '#4CAF50',
      iconSize: 24,
    });
  };

  const truncateHash = (hash: string, start = 10, end = 8) =>
    `${hash.slice(0, start)}...${hash.slice(-end)}`;

  return (
    <View className="px-4 pt-4">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Feather name="message-square" size={20} color="#32CD32" />
          <Text className="text-xl font-bold text-neutral-800 dark:text-white ml-2">
            Latest Data Message
          </Text>
        </View>

        <TouchableOpacity onPress={() => console.log('View more pressed')}>
          <Text className="text-sm font-semibold text-green-600 dark:text-green-400">
            View More
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" className="my-6" />
      ) : (
        data.map((tx, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              router.navigate({
                pathname: '/(detail)/message',
                params: {
                  dataHash: String(tx.dataHash),
                  sourceAgent: String(tx.sourceAgent),
                },
              })
            }
          >
            <View
              className="bg-white dark:bg-neutral-900 p-4 mb-4 rounded-2xl"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <CopyableRow
                label="Data Hash"
                value={truncateHash(tx.dataHash)}
                fullValue={tx.dataHash}
                onCopy={copyToClipboard}
              />
              <Row
                label="Chain"
                value={
                  <View className="flex-row items-center space-x-2">
                    <Bsc />
                    <Text className="text-sm font-semibold text-gray-800 dark:text-white ml-2">
                      {tx.chain}
                    </Text>
                  </View>
                }
              />
              <TxHashRow txHash={tx.txHash} onCopy={copyToClipboard} />
              <Row label="Age" value={convertToTimeAgo(tx.age)} />
              <Row label="Source Agent" value={tx.sourceAgent} />
              <StatusRow status={tx.status} />
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <View className="flex-row justify-between items-center mb-2">
    <Text className="text-gray-500 dark:text-gray-400 text-sm">{label}</Text>
    {typeof value === 'string' ? (
      <Text
        className="text-right text-sm font-semibold text-gray-800 dark:text-white"
        numberOfLines={1}
      >
        {value}
      </Text>
    ) : (
      <View className="flex-row items-center space-x-2">{value}</View>
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
}) => (
  <View className="flex-row justify-between items-center mb-2">
    <Text className="text-gray-500 dark:text-gray-400 text-sm">{label}</Text>
    <View className="flex-row items-center space-x-1">
      <Text className="text-sm font-semibold text-gray-800 dark:text-white mr-2">
        {value}
      </Text>
      <TouchableOpacity onPress={() => onCopy(fullValue)}>
        <Feather name="copy" size={16} color="#32CD32" />
      </TouchableOpacity>
    </View>
  </View>
);

const TxHashRow = ({
  txHash,
  onCopy,
}: {
  txHash: string;
  onCopy: (val: string) => void;
}) => {
  const truncated = `${txHash.slice(0, 10)}...${txHash.slice(-8)}`;

  const handleOpen = async () => {
    await openTxHashInBrowser(txHash);
  };

  return (
    <View className="flex-row justify-between items-center mb-2">
      <Text className="text-gray-500 dark:text-gray-400 text-sm">TX Hash</Text>
      <View className="flex-row items-center space-x-1">
        <TouchableOpacity onPress={handleOpen}>
          <Text className="text-sm font-semibold text-blue-600 dark:text-blue-400 underline mr-2">
            {truncated}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onCopy(txHash)}>
          <Feather name="copy" size={16} color="#32CD32" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const StatusRow = ({ status }: { status: string }) => (
  <View className="flex-row justify-between items-center mt-2">
    <Text className="text-gray-500 dark:text-gray-400 text-sm">Status</Text>
    <Text
      className={`text-sm font-semibold ${
        status === 'SUCCESS'
          ? 'text-green-600 dark:text-green-400'
          : 'text-red-500'
      }`}
    >
      {status}
    </Text>
  </View>
);

export default LatestMessage;
