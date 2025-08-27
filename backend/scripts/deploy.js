// scripts/deploy.js
// This script is used by Hardhat to deploy your smart contract to the blockchain.

async function main() {
  // Get the contract factory to create an instance of the contract.
  const AccessLog = await ethers.getContractFactory("AccessLog");
  
  // Deploy the contract. The 'deploy' function sends a transaction to the network.
  const accessLog = await AccessLog.deploy();

  // Wait for the contract to be deployed.
  await accessLog.deployed();

  console.log("AccessLog contract deployed to:", accessLog.address);
  
  // Log the address to be used by the frontend and the simulator.
  console.log("Copy this address and paste it into sentinel-3-frontend/src/App.js and server.js");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
