import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import AgentDataList from '~/components/list/AgentDataList';
import { fetchLatestSourceAgent } from '~/utils/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Navbar from '~/components/core/Navbar';
import { useFocusEffect } from 'expo-router';

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

const SourceAgentScreen = () => {
  const insets = useSafeAreaInsets();
  const [page, setPage] = useState(1);
  const [data, setData] = useState<SourceAgent[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInitialData = async () => {
    setRefreshing(true);
    try {
      const result: SourceAgent[] = await fetchLatestSourceAgent(1);
      setData(result);
      setPage(2);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchNextPage = async () => {
    if (loading || refreshing) return;
    setLoading(true);
    try {
      const result: SourceAgent[] = await fetchLatestSourceAgent(page);
      setData(prev => [...prev, ...result]);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error fetching next page:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchInitialData();
    }, [])
  );

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingBottom: 0,
        paddingRight: insets.right,
        flex: 1,
      }}
    >
      <Navbar />
      <AgentDataList
        data={data}
        loading={loading}
        refreshing={refreshing}
        onLoadMore={fetchNextPage}
        onRefresh={fetchInitialData}
      />
    </View>
  );
};

export default SourceAgentScreen;
