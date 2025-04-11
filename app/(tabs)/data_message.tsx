import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import MessageDataList from '~/components/list/MessageDataList';
import { fetchLatestMessages } from '~/utils/api';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Navbar from '~/components/core/Navbar';
import { useFocusEffect } from 'expo-router';

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

const DataMessageScreen = () => {
  const insets = useSafeAreaInsets();

  const [page, setPage] = useState(1);
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      setPage(1);
      await fetchData(true); // reset = true
    } catch (error) {
      console.error('Error refreshing messages:', error);
    } finally {
      setRefreshing(false);
    }
  };
  const fetchData = async (reset = false) => {
    setLoading(true);
    try {
      const result = await fetchLatestMessages(reset ? 1 : page);
      setData(prev => (reset ? result : [...prev, ...result]));
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);
  useFocusEffect(
    useCallback(() => {
      setPage(1);
      fetchData(true); // reset = true
    }, [])
  );
  const handleLoadMore = () => {
    if (!loading) setPage(prev => prev + 1);
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingBottom: 0,
        paddingRight: insets.right,
      }}
    >
      <Navbar />
      <MessageDataList
  data={data}
  loading={loading}
  refreshing={refreshing}
  onLoadMore={handleLoadMore}
  onRefresh={handleRefresh}
/>

    </View>
  );
};

export default DataMessageScreen;
