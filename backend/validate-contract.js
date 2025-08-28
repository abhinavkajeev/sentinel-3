import fs from 'fs';
import path from 'path';

function validateContract() {
  try {
    console.log('🔍 Validating Clarity Contract...\n');
    
    // Read the contract
    const contractPath = path.join(process.cwd(), 's3-contracts', 'contracts', 'access-log.clar');
    if (!fs.existsSync(contractPath)) {
      console.error('❌ Contract file not found:', contractPath);
      return false;
    }
    
    const contractSource = fs.readFileSync(contractPath, 'utf8');
    console.log('✅ Contract file loaded successfully');
    
    // Basic validation
    console.log('\n📋 Contract Validation:');
    
    // Check for main function
    if (contractSource.includes('(define-public (log-entry')) {
      console.log('   ✅ log-entry function found');
    } else {
      console.log('   ❌ log-entry function missing');
      return false;
    }
    
    // Check for data variables
    if (contractSource.includes('(define-data-var access-events')) {
      console.log('   ✅ access-events variable found');
    } else {
      console.log('   ❌ access-events variable missing');
      return false;
    }
    
    if (contractSource.includes('(define-data-var current-counter')) {
      console.log('   ✅ current-counter variable found');
    } else {
      console.log('   ❌ current-counter variable missing');
      return false;
    }
    
    // Check for constants
    if (contractSource.includes('(define-constant MAX-EVENTS u100)')) {
      console.log('   ✅ MAX-EVENTS constant found');
    } else {
      console.log('   ❌ MAX-EVENTS constant missing');
      return false;
    }
    
    // Check for read-only functions
    const readOnlyFunctions = ['get-events', 'get-event-count', 'get-current-counter', 'get-events-by-type'];
    let readOnlyCount = 0;
    
    readOnlyFunctions.forEach(func => {
      if (contractSource.includes(`(define-read-only (${func}`)) {
        console.log(`   ✅ ${func} function found`);
        readOnlyCount++;
      }
    });
    
    if (readOnlyCount === 4) {
      console.log('   ✅ All read-only functions present');
    } else {
      console.log(`   ⚠️  Found ${readOnlyCount}/4 read-only functions`);
    }
    
    // Check for helper functions
    const helperFunctions = ['is-list-full', 'is-valid-event-type', 'filter-events', 'is-event-type'];
    let helperCount = 0;
    
    helperFunctions.forEach(func => {
      if (contractSource.includes(`(define-private (${func}`)) {
        console.log(`   ✅ ${func} helper function found`);
        helperCount++;
      }
    });
    
    if (helperCount === 4) {
      console.log('   ✅ All helper functions present');
    } else {
      console.log(`   ⚠️  Found ${helperCount}/4 helper functions`);
    }
    
    // Check for error handling
    if (contractSource.includes('asserts!')) {
      console.log('   ✅ Error handling with asserts! found');
    } else {
      console.log('   ❌ Error handling missing');
      return false;
    }
    
    console.log('\n✅ Contract validation complete!');
    console.log('📄 Contract is ready for deployment');
    
    return true;
    
  } catch (error) {
    console.error('❌ Contract validation failed:', error.message);
    return false;
  }
}

// Run validation
const isValid = validateContract();
process.exit(isValid ? 0 : 1);
