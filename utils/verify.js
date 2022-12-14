const { run } = require("hardhat");

async function Verify(contractAddress, args) {
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("contract already verified");
    } else {
      console.log("e.message");
    }
  }
}

module.exports = {
  Verify,
};
