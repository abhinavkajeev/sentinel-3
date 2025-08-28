// Dummy Clarity contract interaction logic
import {
  fetchCallReadOnlyFunction,
  stringUtf8CV,
  uintCV,
} from "@stacks/transactions";

export const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE";
export const CONTRACT_NAME = "message-board";
export const network = "testnet";

export const getMessageCount = async () => {
  // Dummy: returns 0
  return 0;
};

export const getMessages = async (count) => {
  // Dummy: returns empty array
  return [];
};

export const addMessage = async (message) => {
  // Dummy: does nothing
  return null;
};

export { fetchCallReadOnlyFunction, stringUtf8CV, uintCV };
