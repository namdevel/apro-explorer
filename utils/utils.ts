import * as WebBrowser from "expo-web-browser";  // Import WebBrowser


export const convertToTimeAgo = (timestamp: number) => {
  const currentTime = Date.now() / 1000; // Current time in seconds
  const timeDifference = currentTime - timestamp; // Time difference in seconds

  const seconds = Math.floor(timeDifference);
  const minutes = Math.floor(timeDifference / 60);
  const hours = Math.floor(timeDifference / 3600);
  const days = Math.floor(timeDifference / 86400);

  if (seconds < 60) {
    return `${seconds} second${seconds === 1 ? "" : "s"} ago`;
  } else if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  } else {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }
};

export const openTxHashInBrowser = (txHash: string) => {
    const url = `https://testnet.bscscan.com/tx/${txHash}`;  // BSC Testnet URL
    WebBrowser.openBrowserAsync(url);
};
