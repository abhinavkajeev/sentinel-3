import dotenv from 'dotenv';
import IPFSService from './services/ipfsService.js';
import BlockchainService from './services/blockchainService.js';

// Load environment variables
dotenv.config();

async function testRealBlockchain() {
  try {
    console.log('🚀 Testing Real Stacks Testnet Integration...\n');
    
    // Check environment variables
    const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;
    if (!privateKey) {
      console.error('❌ BLOCKCHAIN_PRIVATE_KEY not found in .env file');
      console.log('Please add your testnet private key to .env file');
      return;
    }
    
    console.log('✅ Environment variables loaded');
    console.log(`🔑 Private Key: ${privateKey.substring(0, 8)}...`);
    
    // Initialize services
    const ipfsService = new IPFSService();
    const blockchainService = new BlockchainService();
    
    console.log('✅ Services initialized');
    
    // Test 1: Upload real image to IPFS
    console.log('\n📸 Step 1: Uploading test image to IPFS...');
    const testImageBuffer = Buffer.from([
      0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
      0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
      0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
      0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
      0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
      0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
      0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
      0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x11, 0x08, 0x00, 0x01,
      0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
      0xFF, 0xC4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0xFF, 0xC4,
      0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xDA, 0x00, 0x0C,
      0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3F, 0x00, 0x8F, 0x80,
      0x00, 0x0F, 0xFF, 0xD9
    ]);
    
    const ipfsResult = await ipfsService.uploadImage(testImageBuffer, 'real-test.jpg');
    console.log('✅ Image uploaded to IPFS:', ipfsResult.hash);
    console.log('   URL:', ipfsResult.url);
    
    // Test 2: Log real ENTRY event to blockchain
    console.log('\n📝 Step 2: Logging ENTRY event to Stacks testnet...');
    const entryResult = await blockchainService.logAccessEvent({
      sessionId: `real_session_${Date.now()}`,
      eventType: 'ENTRY',
      photoHash: ipfsResult.hash,
      privateKey: privateKey
    });
    
    console.log('🎉 ENTRY event logged successfully!');
    console.log('   Transaction Hash:', entryResult.txHash);
    console.log('   Event ID:', entryResult.eventId);
    console.log('   Explorer:', `https://explorer.stacks.co/txid/${entryResult.txHash}?chain=testnet`);
    
    // Test 3: Log real EXIT event to blockchain
    console.log('\n📝 Step 3: Logging EXIT event to Stacks testnet...');
    const exitResult = await blockchainService.logAccessEvent({
      sessionId: `real_session_${Date.now()}`,
      eventType: 'EXIT',
      photoHash: ipfsResult.hash,
      privateKey: privateKey
    });
    
    console.log('🎉 EXIT event logged successfully!');
    console.log('   Transaction Hash:', exitResult.txHash);
    console.log('   Event ID:', exitResult.eventId);
    console.log('   Explorer:', `https://explorer.stacks.co/txid/${exitResult.txHash}?chain=testnet`);
    
    // Test 4: Check transaction status
    console.log('\n🔍 Step 4: Checking transaction status...');
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    
    try {
      const entryStatus = await blockchainService.getTransactionStatus(entryResult.txHash);
      console.log('📊 ENTRY Transaction Status:', entryStatus);
      
      const exitStatus = await blockchainService.getTransactionStatus(exitResult.txHash);
      console.log('📊 EXIT Transaction Status:', exitStatus);
    } catch (statusError) {
      console.log('⚠️  Status check failed (normal for testnet):', statusError.message);
    }
    
    console.log('\n🎉 Real Blockchain Test Complete!');
    console.log('\n📋 Summary:');
    console.log('   • IPFS Upload: ✅ SUCCESS');
    console.log('   • ENTRY Event: ✅ Logged to testnet');
    console.log('   • EXIT Event: ✅ Logged to testnet');
    console.log('   • Transaction Hashes: ✅ Generated');
    console.log('\n🔗 View your transactions:');
    console.log(`   ENTRY: https://explorer.stacks.co/txid/${entryResult.txHash}?chain=testnet`);
    console.log(`   EXIT: https://explorer.stacks.co/txid/${exitResult.txHash}?chain=testnet`);
    
  } catch (error) {
    console.error('❌ Real blockchain test failed:', error.message);
    console.error('Full error:', error);
    
    if (error.message.includes('No such file or directory')) {
      console.log('\n💡 This error usually means:');
      console.log('   1. The contract is not deployed yet');
      console.log('   2. The account has no STX balance');
      console.log('   3. Network connectivity issues');
      console.log('\n🔧 Solutions:');
      console.log('   1. Deploy the contract first: node deploy-contract.js');
      console.log('   2. Get testnet STX from faucet');
      console.log('   3. Check your internet connection');
    }
  }
}

testRealBlockchain();
