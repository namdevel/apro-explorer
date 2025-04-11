import * as React from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Text } from "~/components/ui/text";
import { StyleSheet, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Toast } from "toastify-react-native";
import { fetchDetailMessage } from "~/utils/api";
import CodeHighlighter from "react-native-code-highlighter";
import { irBlack } from "react-syntax-highlighter/dist/esm/styles/hljs";
import BtcUsd from "~/lib/svg/BtcUsd";
import Bsc from "~/lib/svg/Bsc";
import Default from "~/lib/svg/Default";
import Apro from "~/lib/svg/Apro";
import {convertToTimeAgo, openTxHashInBrowser} from "~/utils/utils";
const MessageDetail = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { dataHash, sourceAgent } = useLocalSearchParams() as { dataHash: string; sourceAgent: string };
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (dataHash && sourceAgent) {
      fetchDetailMessage(dataHash)
        .then((res) => setData(res.result))
        .finally(() => setLoading(false));
    }
  }, [dataHash, sourceAgent]);

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
      <Text>Data not found</Text>
    </View>
  );

  const renderPayload = (item: any) => {
    const payloadItems = [
      { label: "Feed", value: item.pair },
      { label: "Network", value: item.networks?.join(", ") },
      { label: "Bid Price", value: '$' + parseFloat(item.bidPrice).toString() },
      { label: "Mid Price", value: '$' + parseFloat(item.midPrice).toString() },
      { label: "Ask Price", value: '$' + parseFloat(item.askPrice).toString() },
      { label: "Feed ID", value: item.feedId, canCopy: true },
    ];



    return (
      <View className="bg-white dark:bg-neutral-900 p-4 mb-4 rounded-2xl shadow">
        {payloadItems.map(({ label, value, canCopy }, idx) => (
          <View key={idx} className="flex-row justify-between items-center mb-3">
            <Text className="text-sm text-gray-400 dark:text-gray-500 w-36">
              {label}
            </Text>

            <View className="flex-1 flex-row justify-end items-center">
              {label === "Feed" && (
                <BtcUsd />
              )}
              {label === "Network" && (
                <Bsc />
              )}
              <Text
                className="text-sm font-semibold text-gray-800 dark:text-white ml-1"
                numberOfLines={1}
                ellipsizeMode="tail"
              >

                {value !== undefined && value !== null ? String(value) : "-"}
              </Text>

              {canCopy && value && typeof value === "string" && (
                <TouchableOpacity
                  onPress={() => copyToClipboard(value)}
                  className="ml-2"
                >
                  <Feather name="copy" size={16} color="#32CD32" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="relative flex-row items-center px-4 py-3">
        <TouchableOpacity
          onPress={() => router.back()} 
          className="mr-2 z-10">
          <Feather name="chevron-left" size={24} color="#32CD32" />
        </TouchableOpacity>

        <Text className="absolute left-0 right-0 text-center text-xl font-bold text-foreground">
          Data Message Details
        </Text>
      </View>


      {loading ? (
        loadingUI
      ) : !data ? (
        notFoundUI
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          {/* Source Agent */}
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
            <Text className="text-lg text-white/90 text-center mt-1">
              Source Agent
            </Text>
            <View className="flex-row items-center justify-center mt-1 space-x-2">
              {sourceAgent.toLowerCase().includes('apro') ? <Apro /> : <Default />}
              <Text className="text-xl font-extrabold text-white ml-2">
                {sourceAgent}
              </Text>
            </View>

          </View>
          {/* <Card label="Source Agent" value={data.sourceAgent || "-"} fullWidth /> */}

          {/* 2 Column Data */}
          <View className="flex-row flex-wrap justify-between mt-5 px-4">
            <Card label="Data Hash" value={data.dataHash || "-"} canCopy onCopy={copyToClipboard} />
            <Card label="Chain" value={data.chain || "-"} />
            <Card
              label="TX Hash"
              value={data.txHash || "-"}
              canCopy
              onCopy={copyToClipboard}
              onPress={() => openTxHashInBrowser(data.txHash)}  // Open BSCScan on press
            />
            <Card label="Age" value={data.age ? convertToTimeAgo(data.age) : "-"} />
            <Card label="Verification Contract" value={data.verificationContract || "-"} canCopy onCopy={copyToClipboard} />
            <Card label="Status" value={data.status || "UNKNOWN"} isStatus />
          </View>

          {/* Payload Section */}
          <View className="mt-3 px-4">
            {data.payload?.detailItems?.length > 0 &&
              data.payload.detailItems.map((item: any, index: number) => (
                <React.Fragment key={index}>{renderPayload(item)}</React.Fragment>
              ))}
          </View>

          {data.signatures?.length > 0 && (
            <View className="mt-3 px-4">
              {/* <Text className="text-lg font-bold text-foreground mb-2">Signatures</Text> */}
              <View className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#171717" }}>
                <CodeHighlighter
                  hljsStyle={irBlack}
                  language="plaintext"
                  wrapLongLines={true}
                  textStyle={styles.text}
                  scrollViewProps={{
                    horizontal: false,
                    style: { backgroundColor: "#171717" }, // <- background scrollview utama
                    contentContainerStyle: {
                      backgroundColor: "#171717", // <- background content scrollview
                      minWidth: "100%",
                    },
                  }}
                  customStyle={{
                    backgroundColor: "#171717",
                    padding: 16,
                  }}
                >
                  {JSON.stringify(data.signatures, null, 2)}
                </CodeHighlighter>
              </View>
            </View>
          )}

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
    isStatus && value === "SUCCESS"
      ? "text-green-600 dark:text-green-400"
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
  codeContainer: {
    padding: 16,
    minWidth: "100%",
    backgroundColor: "#171717",

  },
  text: {
    fontSize: 12,
  },
});

export default MessageDetail;
