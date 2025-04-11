import * as React from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { Text } from "~/components/ui/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Toast } from "toastify-react-native";
import {convertToTimeAgo, openTxHashInBrowser} from "~/utils/utils";
import { fetchDetailAgent } from "~/utils/api";
import Bsc from "~/lib/svg/Bsc";

const AgentDetail = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { agentId, configDigest } = useLocalSearchParams() as {
    agentId: string;
    configDigest: string;
  };

  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (agentId) {
      fetchDetailAgent(agentId, configDigest)
        .then((res) => setData(res.result[0]))
        .finally(() => setLoading(false));
    }
  }, [agentId, configDigest]);

  const copyToClipboard = async (content: string) => {
    await Clipboard.setStringAsync(content);
    Toast.show({
      type: "success",
      text1: "Copied to clipboard",
      position: "top",
      visibilityTime: 1000,
      autoHide: true,
      iconColor: "#4CAF50",
      iconSize: 24,
    });
  };

  const loadingUI = (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" />
    </View>
  );

  const notFoundUI = (
    <View className="flex-1 justify-center items-center">
      <Text>Agent not found</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="relative flex-row items-center px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="mr-2 z-10">
          <Feather name="chevron-left" size={24} color="#32CD32" />
        </TouchableOpacity>
        <Text className="absolute left-0 right-0 text-center text-xl font-bold text-foreground">
          Agent Details
        </Text>
      </View>

      {loading ? (
        loadingUI
      ) : !data ? (
        notFoundUI
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          {/* Agent Header */}
          <View
            style={{
              backgroundColor: "#000",
              paddingTop: 30,
              paddingBottom: 32,
              paddingHorizontal: 16,
              position: "relative",
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
            <Text className="text-lg text-white/90 text-center mt-1">Source Agent</Text>
            <View className="items-center">
              {/* Name */}
              <Text className="text-xl font-extrabold text-white text-center">{data.name || "-"}</Text>

              {/* Source Agent ID with copy */}
              <View className="flex-row items-center mt-1">
                <Text className="text-sm text-white/80 mr-2" selectable>
                  {data.sourceAgent || "-"}
                </Text>
                <TouchableOpacity onPress={() => copyToClipboard(data.agentHeader?.sourceAgentId || "-")}>
                  <Feather name="copy" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Agent Info */}
          <View className="flex-row flex-wrap justify-between mt-4 px-4">
            <Card label="Chain" value={data.chain || "-"} />
            <Card
              label="TX Hash"
              value={data.txHash || "-"}
              canCopy
              onCopy={copyToClipboard}
              onPress={() => openTxHashInBrowser(data.txHash)}  // Open BSCScan on press
            />
            <Card label="Age" value={convertToTimeAgo(data.age) || "-"} />
            <Card label="Send Volume" value={data.sendVolume?.toString() || "0"} />
            <Card label="Pass Percentage" value={`${data.passPercentage || "0"}%`} />
            <Card label="Status" value={data.status.toString() || "UNKNOWN"} isStatus />
          </View>

          {/* Signature JSON */}
          <View className="mt-3 px-4">
            <View
              className="bg-white dark:bg-neutral-900 p-4 rounded-2xl"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Text className="text-xs text-gray-700 dark:text-white" selectable>
                {JSON.stringify(
                  {
                    signers: data.signers,
                    threshold: data.threshold,
                    converterAddress: data.convertAddress,
                    agentHeader: data.header, // This is correct key
                  },
                  null,
                  2
                )}
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const Card = ({
  label,
  value,
  canCopy = false,
  onCopy,
  isStatus = false,
  fullWidth = false,
  onPress,
}: {
  label: string;
  value: string;
  canCopy?: boolean;
  onCopy?: (val: string) => void;
  isStatus?: boolean;
  fullWidth?: boolean;
  onPress?: () => void;  // Added onPress
}) => {
  const color =
    isStatus && value === "active"
      ? "text-green-600 dark:text-green-400 uppercase"
      : isStatus
        ? "text-red-500"
        : "text-gray-800 dark:text-white";

  const truncated = value.length > 20 ? `${value.slice(0, 6)}...${value.slice(-6)}` : value;

  return (
    <View
      className="bg-white dark:bg-neutral-900 p-4 mb-4 rounded-2xl"
      style={{
        width: fullWidth ? "100%" : "48%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <TouchableOpacity onPress={onPress}>
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-sm text-gray-400 dark:text-gray-500">{label}</Text>

            {label === "Chain" ? (
              <View className="flex-row items-center mt-1">
                <Bsc />
                <Text className={`text-base font-semibold ml-2 ${color}`} numberOfLines={2}>
                  {truncated}
                </Text>
              </View>
            ) : (
              <Text className={`text-base font-semibold mt-1 ${color}`} numberOfLines={2}>
                {truncated}
              </Text>
            )}
          </View>
          {canCopy && onCopy && (
            <TouchableOpacity onPress={() => onCopy(value)}>
              <Feather name="copy" size={18} color="#32CD32" />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
  },
});

export default AgentDetail;
