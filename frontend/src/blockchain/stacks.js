// Stacks wallet/connectivity logic
import { connect, disconnect, isConnected, request } from "@stacks/connect";

export const connectWallet = async (onFinish) => {
  return connect({
    appDetails: {
      name: "Message Board",
      icon: window.location.origin + "/logo.svg",
    },
    onFinish,
  });
};

export const disconnectWallet = () => disconnect();
export const checkIsConnected = () => isConnected();
export const requestContractCall = request;
