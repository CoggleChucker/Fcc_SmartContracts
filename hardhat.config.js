require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("@nomiclabs/hardhat-ethers");

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const EHTERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const GODWOKEN_RPC_URL = process.env.GODWOKEN_RPC_URL;
const GODWOKEN_PRIVATE_KEY = process.env.GODWOKEN_PRIVATE_KEY;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  //solidity: "0.8.17",
  solidity: {
    compilers: [{ version: "0.8.17" }, { version: "0.6.6" }],
  },

  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5,
      blockConfirmations: 4,
    },

    godwoken: {
      url: GODWOKEN_RPC_URL,
      accounts: [GODWOKEN_PRIVATE_KEY],
      chainId: 71401,
      blockConfirmations: 3,
    },

    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    },
  },

  etherscan: {
    apiKey: EHTERSCAN_API_KEY,
  },

  namedAccounts: {
    deployer: {
      default: 0,
      31337: 0,
      1337: 0,
    },
  },
};
