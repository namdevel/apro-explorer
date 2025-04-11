import React from 'react';
import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Text } from '~/components/ui/text';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Bsc from '~/lib/svg/Bsc'; // Optional chain icon

type Validator = {
  name: string;
  chain: string;
  verificationVolume: number;
  status: string;
};

const ValidatorRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
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

const ValidatorStatus = ({ status }: { status: string }) => (
  <View className="flex-row justify-between items-center">
    <Text className="text-gray-500 dark:text-gray-400 text-sm">Status</Text>
    <Text
      className={`text-sm font-semibold ${
        status === 'ACTIVE'
          ? 'text-green-600 dark:text-green-400'
          : 'text-red-500'
      }`}
    >
      {status}
    </Text>
  </View>
);

const Validator = ({
  data,
  loading,
}: {
  data: Validator[];
  loading: boolean;
}) => {

  return (
    <View className="px-4 pt-4">
      <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                    <FontAwesome6 name="user-astronaut" size={20} color="#32CD32" />
                    <Text className="text-xl font-bold text-neutral-800 dark:text-white ml-2">
                        Validators
                    </Text>
                </View>
                
            </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" className="my-6" />
      ) : (
        data.map((val, index) => (
          <View
            key={index}
            className="bg-white dark:bg-neutral-900 p-4 mb-4 rounded-2xl"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <ValidatorRow
              label="Name"
              value={
                <View className="flex-row items-center">
                  <Text className="ml-2 text-sm font-semibold text-gray-800 dark:text-white">
                    {val.name}
                  </Text>
                </View>
              }
            />
            <ValidatorRow
              label="Chain"
              value={
                <View className="flex-row items-center">
                  <Bsc />
                  <Text className="ml-2 text-sm font-semibold text-gray-800 dark:text-white">
                    {val.chain}
                  </Text>
                </View>
              }
            />
            <ValidatorRow
              label="Verification Volume"
              value={val.verificationVolume.toLocaleString()}
            />
            <ValidatorStatus status={val.status} />
          </View>
        ))
      )}
    </View>
  );
};

export default Validator;
