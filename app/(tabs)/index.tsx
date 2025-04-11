import React, { useEffect, useState, useCallback } from "react";
import {
    ScrollView,
    View,
    ActivityIndicator,
    RefreshControl,
} from "react-native";

import Navbar from "~/components/core/Navbar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { fetchAiAgentOverview, fetchLatestMessages, fetchLatestSourceAgent, fetchValidators } from "~/utils/api";
import Header from "~/components/home/Header";
import CardStat from "~/components/home/CardStat";
import LatestMessage from "~/components/home/LatestMessage";
import LatestSourceAgent from "~/components/home/LatestSourceAgent";
import Validator from "~/components/home/Validator";
export default function Index() {
    const insets = useSafeAreaInsets();

    const [overview, setOverview] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [loadingSourceAgent, setLoadingSourceAgent] = useState(true);
    const [loadingValidator, setLoadingValidator] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [latestMessages, setLatestMessages] = useState<any[]>([]);
    const [latestSourceAgent, setlatestSourceAgent] = useState<any[]>([]);
    const [Validators, setValidators] = useState<any[]>([]);

    const loadData = async () => {
        try {
            setLoading(true);
            setLoadingMessages(true);
            setLoadingSourceAgent(true);
            setLoadingValidator(true);

            const [overviewData, messages, sourceAgent, Validators] = await Promise.all([
                await fetchAiAgentOverview(),
                await fetchLatestMessages(1, 5),
                await fetchLatestSourceAgent(1, 5),
                await fetchValidators(),
            ]);

            setOverview(overviewData);
            setLatestMessages(messages);
            setlatestSourceAgent(sourceAgent);
            setValidators(Validators);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
            setLoadingMessages(false);
            setLoadingSourceAgent(false);
            setLoadingValidator(false);
            setRefreshing(false);
        }
    };


    useEffect(() => {
        loadData();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadData();
    }, []);

    return (
        <>
            <View
                style={{
                    paddingTop: insets.top,
                    paddingLeft: insets.left,
                    paddingBottom: 0,
                    paddingRight: insets.right,
                }}
            >
                <Navbar />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}
                className="flex-1"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#32CD32"]}
                    />
                }
            >


                <Header refresh={refreshing} />
                {loading ? (
                    <View className="items-center justify-center py-12">
                        <ActivityIndicator size="large" color="#32CD32" />
                    </View>
                ) : (
                    <CardStat overview={overview} />

                )}
                <LatestMessage data={latestMessages} loading={loadingMessages} />
                <LatestSourceAgent data={latestSourceAgent} loading={loadingSourceAgent} />
                <Validator data={Validators} loading={loadingValidator} />
            </ScrollView>
        </>
    );
}