const { ethers, run, network } = require("hardhat");
const { DECIMALS, INITIALPRICE } = require("../hardhat-helper-config");

async function main() {
  const fundmeContractFactory = await ethers.getContractFactory(
    "SimpleStorage"
  );
  console.log("Deploying contract...");
  const deployedContract = await fundmeContractFactory.deploy();
  await deployedContract.deployed();

  console.log("Contract deployed");
  console.log(deployedContract.address);

  //Checking for local network. If on local network there is no need to verify
  if (network.config.chainId != 31337 && network.config.chainId != 1337) {
    console.log("Waiting for transaction receipt");
    await deployedContract.deployTransaction.wait(3);
    await Verify(deployedContract.address, []);
  }
}

async function Verify(contractAddress, args) {
  console.log("Verifying Contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArgumenst: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Contract already verified");
    } else {
      console.log(e.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
