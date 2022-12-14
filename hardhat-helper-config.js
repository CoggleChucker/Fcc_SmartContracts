const { network } = require("hardhat");

const networkConfig = {
  5: {
    name: "Goerli",
    AggregatorAddress: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
  },
};

const LOCALCHAINS = ["hardhat", "localhost"];

const DECIMALS = 8;
const INITIALPRICE = 200000000000;

module.exports = {
  networkConfig,
  LOCALCHAINS,
  DECIMALS,
  INITIALPRICE,
};
