const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai");
const { LOCALCHAINS } = require("../../hardhat-helper-config");

!LOCALCHAINS.includes(network.name)
  ? describe.skip
  : describe("Fundme_tests", async () => {
      let fundmeContract;
      let inputAmount = ethers.utils.parseEther("1");
      let deployer;
      let attacker;
      let mockAgg;
      beforeEach(async () => {
        /*Other way to get deployer account*/
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        attacker = accounts[1];

        //deployer = await getNamedAccounts().deployer;
        await deployments.fixture(["all"]);

        fundmeContract = await ethers.getContract("Fundme", deployer);
        mockAgg = await ethers.getContract("MockV3Aggregator", deployer);
      });

      describe("Constructor_test", async () => {
        it("Checks if correct aggregator is deployed", async () => {
          const contractAggregator = await fundmeContract.priceFeed();
          assert.equal(contractAggregator, mockAgg.address);
        });

        it("Checks for owners address", async () => {
          const contractOwnerAddress = await fundmeContract.ownerAddress();
          assert.equal(contractOwnerAddress, deployer.address);
        });
      });

      describe("Fund_function_tests", async () => {
        it("calls fund function with insufficient funds", async () => {
          await expect(fundmeContract.FundMe()).to.be.revertedWith(
            "Not enough funds"
          );
        });

        it("calls fund function with sufficient funds", async () => {
          await fundmeContract.FundMe({ value: inputAmount });
          const response = fundmeContract.fundersToAmount(deployer);

          assert(inputAmount, response.toString());
        });
      });

      describe("Withdraw_tests", async () => {
        beforeEach(async () => {
          await fundmeContract.FundMe({ value: inputAmount });
        });

        it("Checks if onlyowner modifier is working as intended", async () => {
          //Setting
          const startingContractBalance = await fundmeContract.provider.getBalance(
            fundmeContract.address
          );

          const startingDeployerBalance = await fundmeContract.provider.getBalance(
            deployer.address
          );

          //Acting
          const transactionResponce = await fundmeContract.withdraw();
          const transactionReceipt = await transactionResponce.wait(1);

          const endingContractBalance = await fundmeContract.provider.getBalance(
            fundmeContract.address
          );

          const endingDeployerBalance = await fundmeContract.provider.getBalance(
            deployer.address
          );

          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          const totalGasCost = gasUsed.mul(effectiveGasPrice);

          //Assert
          assert.equal(endingContractBalance, 0);
          assert.equal(
            endingDeployerBalance.add(totalGasCost).toString(),
            startingContractBalance.add(startingDeployerBalance).toString()
          );
        });

        it("Checks withdraw function with multiple funders", async () => {
          //Setup
          const fundersAcc = await ethers.getSigners();
          for (let i = 1; i < 7; i++) {
            let fundersConnectedContract = await fundmeContract.connect(
              fundersAcc[i]
            );
            await fundersConnectedContract.FundMe({ value: inputAmount });
          }

          const startingContractBalance = await fundmeContract.provider.getBalance(
            fundmeContract.address.toString()
          );

          const startingDeployerBalance = await fundmeContract.provider.getBalance(
            deployer.address
          );

          //Act
          const transactionResponce = await fundmeContract.withdraw();
          const transactionReceipt = await transactionResponce.wait(1);

          const endingContractBalance = await fundmeContract.provider.getBalance(
            fundmeContract.address.toString()
          );

          const endingDeployerBalance = await fundmeContract.provider.getBalance(
            deployer.address
          );

          //calculating gas cost
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          const totalGasCost = gasUsed.mul(effectiveGasPrice);

          //Check

          assert.equal(endingContractBalance, 0);
          assert.equal(
            endingDeployerBalance.add(totalGasCost).toString(),
            startingContractBalance.add(startingDeployerBalance).toString()
          );

          //Check if array is reset
          await expect(fundmeContract.funders(0)).to.be.reverted;

          for (let i = 1; i < 7; i++) {
            await assert.equal(
              await fundmeContract.fundersToAmount(fundersAcc[i].address),
              0
            );
          }
        });
      });
    });
