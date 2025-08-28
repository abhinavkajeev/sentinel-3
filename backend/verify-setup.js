import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

function verifySetup() {
  console.log('🔍 Verifying Sentinel-3 Blockchain Setup...\n');
  
  let allGood = true;
  
  // Check blockchain private key
  const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;
  if (!privateKey) {
    console.log('❌ BLOCKCHAIN_PRIVATE_KEY not found');
    allGood = false;
  } else {
    console.log('✅ BLOCKCHAIN_PRIVATE_KEY found');
    console.log(`   Length: ${privateKey.length} characters`);
    console.log(`   Format: ${privateKey.substring(0, 8)}...`);
    
    // Basic format validation
    if (privateKey.length !== 64) {
      console.log('⚠️  Warning: Private key should be 64 characters long');
    }
    
    if (!/^[0-9a-fA-F]+$/.test(privateKey)) {
      console.log('⚠️  Warning: Private key should contain only hex characters (0-9, a-f)');
    }
  }
  
  // Check contract address
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    console.log('❌ CONTRACT_ADDRESS not found');
    allGood = false;
  } else {
    console.log('✅ CONTRACT_ADDRESS found');
    console.log(`   Address: ${contractAddress}`);
    
    // Basic format validation
    if (!contractAddress.startsWith('ST')) {
      console.log('⚠️  Warning: Contract address should start with "ST"');
    }
  }
  
  // Check network
  const network = process.env.BLOCKCHAIN_NETWORK;
  if (!network) {
    console.log('❌ BLOCKCHAIN_NETWORK not found');
    allGood = false;
  } else {
    console.log('✅ BLOCKCHAIN_NETWORK found');
    console.log(`   Network: ${network}`);
    
    if (network !== 'testnet' && network !== 'mainnet') {
      console.log('⚠️  Warning: Network should be "testnet" or "mainnet"');
    }
  }
  
  // Check IPFS
  const pinataJWT = process.env.PINATA_JWT;
  if (!pinataJWT) {
    console.log('❌ PINATA_JWT not found');
    allGood = false;
  } else {
    console.log('✅ PINATA_JWT found');
    console.log(`   Length: ${pinataJWT.length} characters`);
  }
  
  console.log('\n📋 Setup Summary:');
  if (allGood) {
    console.log('🎉 All required variables are set!');
    console.log('\n🚀 Next steps:');
    console.log('1. Get testnet STX from faucet');
    console.log('2. Run: deploy-and-test.bat');
    console.log('3. Or manually: node deploy-contract.js');
  } else {
    console.log('❌ Some required variables are missing');
    console.log('\n🔧 Please add the missing variables to your .env file');
  }
  
  return allGood;
}

// Run verification
const isValid = verifySetup();
process.exit(isValid ? 0 : 1);
