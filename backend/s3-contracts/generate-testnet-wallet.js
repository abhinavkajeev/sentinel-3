import { generateSecretKey, generateWallet } from '@stacks/wallet-sdk';
import { StacksTestnet } from '@stacks/network';
import { readFileSync, writeFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

async function generateTestnetWallet() {
  try {
    console.log('🔐 Generating new testnet wallet...');
    
    // Generate a new secret key
    const secretKey = generateSecretKey();
    const wallet = await generateWallet({
      secretKey,
      password: 'testnet-password',
    });
    
    const account = wallet.accounts[0];
    const privateKey = account.stxPrivateKey;
    const address = account.address;
    
    console.log('\n✅ Wallet generated successfully!');
    console.log(`📍 Address: ${address}`);
    console.log(`🔑 Private Key: ${privateKey}`);
    
    // Save to .env file
    const envContent = `# Testnet Wallet Configuration
DEPLOYER_PRIVATE_KEY=${privateKey}
DEPLOYER_ADDRESS=${address}
CONTRACT_ADDRESS=${address}

# Network Configuration
NETWORK=testnet
STACKS_API_URL=https://api.testnet.hiro.so

# MongoDB Configuration
MONGODB_URI=mongodb://127.0.0.1:27017/sentinel3

# IPFS Configuration
PINATA_API_KEY=your_pinata_api_key_here
PINATA_SECRET_KEY=your_pinata_secret_key_here

# Server Configuration
PORT=3070
NODE_ENV=development
`;
    
    writeFileSync('.env', envContent);
    console.log('\n💾 Configuration saved to .env file');
    
    console.log('\n📋 Next Steps:');
    console.log('1. Get test STX from faucet: https://faucet.stacks.co/');
    console.log('2. Wait for confirmation (usually 1-2 minutes)');
    console.log('3. Deploy contract using: node deploy-to-testnet.js');
    
    console.log('\n⚠️  IMPORTANT: Keep your private key secure!');
    console.log('   This is for testnet only - never use real funds with this key.');
    
    return { address, privateKey };
    
  } catch (error) {
    console.error('❌ Failed to generate wallet:', error);
    throw error;
  }
}

// Run wallet generation
generateTestnetWallet()
  .then(() => {
    console.log('\n🎉 Wallet generation completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Wallet generation failed:', error);
    process.exit(1);
  });
