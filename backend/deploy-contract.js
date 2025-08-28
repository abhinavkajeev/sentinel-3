import { StacksTestnet } from '@stacks/network';
import { makeContractDeploy, broadcastTransaction } from '@stacks/transactions';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function deployContract() {
  try {
    console.log('🚀 Deploying Sentinel-3 Smart Contract...\n');
    
    // Check environment variables
    const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;
    if (!privateKey) {
      console.error('❌ BLOCKCHAIN_PRIVATE_KEY not found in .env file');
      console.log('Please add: BLOCKCHAIN_PRIVATE_KEY=your_private_key_here');
      return;
    }
    
    // Initialize network
    const network = new StacksTestnet();
    console.log(`📡 Network: ${network.chainId} (${network.getCoreApiUrl ? network.getCoreApiUrl() : 'https://api.testnet.hiro.so'})`);
    
    // Read contract file
    const contractPath = path.join(process.cwd(), 's3-contracts', 'contracts', 'access-log.clar');
    if (!fs.existsSync(contractPath)) {
      console.error('❌ Contract file not found:', contractPath);
      return;
    }
    
    const contractSource = fs.readFileSync(contractPath, 'utf8');
    console.log('📄 Contract source loaded');
    
    // Contract details
    const contractName = 'access-log';
    const contractAddress = process.env.CONTRACT_ADDRESS || 'ST1PQHQKV0RJXZFYVDEQMMKSWZQAG97KXKPSWD05E';
    
    console.log(`🏗️  Contract: ${contractName}`);
    console.log(`📍 Address: ${contractAddress}`);
    console.log(`🔑 Private Key: ${privateKey.substring(0, 8)}...`);
    
    // Create deployment transaction
    const deployOptions = {
      contractName,
      contractSource,
      senderKey: privateKey,
      network,
      fee: 10000, // Set appropriate fee
      postConditionMode: 1, // Allow
      anchorMode: 3, // Add anchor mode for older versions
    };
    
    console.log('\n⏳ Creating deployment transaction...');
    const transaction = await makeContractDeploy(deployOptions);
    
    console.log('📤 Broadcasting transaction...');
    const broadcastResponse = await broadcastTransaction(transaction, network);
    
    if (broadcastResponse.error) {
      console.error('❌ Deployment failed:', broadcastResponse.error);
      return;
    }
    
    console.log('\n🎉 Contract Deployed Successfully!');
    console.log(`📋 Transaction Hash: ${broadcastResponse.txid}`);
    console.log(`🔗 Explorer: https://explorer.stacks.co/txid/${broadcastResponse.txid}?chain=testnet`);
    console.log(`📄 Contract: ${contractAddress}.${contractName}`);
    
    console.log('\n📝 Next Steps:');
    console.log('1. Wait for transaction confirmation (usually 1-2 minutes)');
    console.log('2. Update your .env file with the contract address if different');
    console.log('3. Test the contract functions');
    console.log('4. Your backend is now ready to log events to the blockchain!');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    console.error('Full error:', error);
  }
}

deployContract();
