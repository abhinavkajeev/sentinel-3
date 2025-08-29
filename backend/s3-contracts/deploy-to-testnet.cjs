// deploy-to-testnet.js
const { StacksTestnet } = require('@stacks/network');
const { 
  makeContractDeploy, 
  broadcastTransaction,
  AnchorMode,
  PostConditionMode
} = require('@stacks/transactions');
const { readFileSync } = require('fs');

// Configuration
const NETWORK = new StacksTestnet();
const CONTRACT_NAME = 'access-log';
const CONTRACT_FILE = './contracts/access-log.clar';

// Your private key (replace with your actual private key)
const PRIVATE_KEY = 'your_private_key_here'; // Replace this!

async function deployContract() {
  try {
    console.log('Reading contract file...');
    const contractSource = readFileSync(CONTRACT_FILE, 'utf8');
    
    console.log('Creating deployment transaction...');
    const txOptions = {
      contractName: CONTRACT_NAME,
      codeBody: contractSource,
      senderKey: PRIVATE_KEY,
      network: NETWORK,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
    };
    
    const transaction = await makeContractDeploy(txOptions);
    
    console.log('Broadcasting transaction...');
    const result = await broadcastTransaction(transaction, NETWORK);
    
    if (result.error) {
      console.error('Deployment failed:', result);
    } else {
      console.log('✅ Contract deployed successfully!');
      console.log('Transaction ID:', result);
      console.log(`Check status at: https://explorer.hiro.so/txid/${result}?chain=testnet`);
    }
    
  } catch (error) {
    console.error('Error deploying contract:', error);
  }
}

// Run deployment
deployContract();