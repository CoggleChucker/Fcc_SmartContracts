const { network } = require("hardhat");
const { networkConfig, LOCALCHAINS } = require("../hardhat-helper-config");
const { Verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let priceFeed;

  if (!LOCALCHAINS.includes(network.name)) {
    log("Live chain found, looking for dependent contracts");
    priceFeed = networkConfig[chainId]["AggregatorAddress"];
  } else {
    log("Development chain found, looking for mocks");
    const mockAggregator = await get("MockV3Aggregator");
    priceFeed = mockAggregator.address;
  }

  const fundmeContract = await deploy("Fundme", {
    contract: "Fundme",
    from: deployer,
    log: true,
    args: [priceFeed],
    waitConfirmation: network.config.blockConfirmation,
  });

  log("Fumdme contract deployed successfully");
  if (!LOCALCHAINS.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    log("Verifying contract");
    await Verify(fundmeContract.address, [priceFeed]);
  }

  log("---------------------------------------------------");
};

module.exports.tags = ["all"];
