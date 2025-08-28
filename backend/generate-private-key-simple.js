import dotenv from 'dotenv';
import crypto from 'crypto';

// Load environment variables
dotenv.config();

function generatePrivateKey() {
  try {
    console.log('🔑 Generating Private Key from Secret Phrase...\n');
    console.log('⚠️  IMPORTANT: This script will help you generate a private key');
    console.log('   from your secret phrase. Keep both secure!\n');
    
    // Check if secret phrase is in .env
    let secretPhrase = process.env.SECRET_PHRASE;
    
    if (!secretPhrase) {
      console.log('📝 Please enter your 12 or 24 word secret phrase:');
      console.log('   (You can also add SECRET_PHRASE=your_phrase_here to .env file)');
      console.log('\n💡 Example:');
      console.log('   SECRET_PHRASE=abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about');
      console.log('\n❌ No secret phrase found in .env file');
      console.log('\n🔧 To add your secret phrase to .env file:');
      console.log('   1. Open your .env file');
      console.log('   2. Add: SECRET_PHRASE=your_actual_secret_phrase_here');
      console.log('   3. Run this script again');
      console.log('\n⚠️  WARNING: Never share your secret phrase with anyone!');
      return;
    }
    
    console.log('✅ Secret phrase found in .env file');
    console.log(`   Length: ${secretPhrase.split(' ').length} words`);
    
    // Validate secret phrase format
    const words = secretPhrase.trim().split(' ');
    if (words.length !== 12 && words.length !== 24) {
      console.log('❌ Secret phrase must be 12 or 24 words');
      console.log(`   Found: ${words.length} words`);
      return;
    }
    
    console.log('✅ Secret phrase format is valid');
    
    try {
      // Generate a deterministic private key from the secret phrase
      // This is a simplified approach - in production, use proper BIP39 derivation
      const phraseHash = crypto.createHash('sha256').update(secretPhrase).digest('hex');
      
      // Ensure it's exactly 64 characters (32 bytes)
      const privateKey = phraseHash.substring(0, 64);
      
      console.log('\n🎉 Private Key Generated Successfully!');
      console.log('🔑 Private Key:', privateKey);
      console.log(`   Length: ${privateKey.length} characters`);
      
      console.log('\n📝 Add this to your .env file:');
      console.log(`BLOCKCHAIN_PRIVATE_KEY=${privateKey}`);
      
      console.log('\n⚠️  SECURITY REMINDERS:');
      console.log('   • Keep your private key secret');
      console.log('   • Never share it with anyone');
      console.log('   • Store it securely');
      console.log('   • Consider removing SECRET_PHRASE from .env after getting private key');
      
      console.log('\n🚀 Next steps:');
      console.log('1. Copy the private key above');
      console.log('2. Add it to your .env file');
      console.log('3. Run: node verify-setup.js');
      console.log('4. Then: deploy-and-test.bat');
      
      console.log('\n💡 Note: This is a simplified key generation method.');
      console.log('   For production use, consider using proper BIP39 derivation tools.');
      
    } catch (error) {
      console.error('❌ Failed to generate private key:', error.message);
      console.log('\n💡 Common issues:');
      console.log('   • Check that all words are correct');
      console.log('   • Ensure words are separated by spaces');
      console.log('   • Verify the phrase is from Leather Wallet');
    }
    
  } catch (error) {
    console.error('❌ Script failed:', error.message);
  }
}

generatePrivateKey();
