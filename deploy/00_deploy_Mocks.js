const { network } = require("hardhat");
const {
  DECIMALS,
  INITIALPRICE,
  LOCALCHAINS,
} = require("../hardhat-helper-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  if (LOCALCHAINS.includes(network.name)) {
    log("Local development chain found. Deploying mocks......");
    //log(deployer.toString());

    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIALPRICE],
    });

    log("Mocks deployed");
    log("-----------------------------------------------");
  }
};

module.exports.tags = ["all", "mocks"];
