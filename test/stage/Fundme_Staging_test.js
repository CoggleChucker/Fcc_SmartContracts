const { network, ethers, getNamedAccounts } = require("hardhat");
const { LOCALCHAINS } = require("../../hardhat-helper-config");
const { expect, assert } = require("chai");

LOCALCHAINS.includes(network.name)
  ? describe.skip
  : describe("Fundme_stagingTest", async () => {
      let fundmeContract;
      let deployer;
      const inputValue = await ethers.utils.parseEther("0.4");
      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        fundmeContract = await ethers.getContract("Fundme", deployer);
      });

      it("Checks if funding and withdrawing is working correctly", async () => {
        await fundmeContract.FundMe({
          value: inputValue,
        });

        await fundmeContract.withdraw();

        let endingContractBalance = await fundmeContract.provider.getBalance(
          fundmeContract.address
        );

        assert.equal(endingContractBalance.toString(), "0");
      });
    });
