//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "./PriceContverter.sol";

contract Fundme {
    using GetEthPrice for uint256;
    address public immutable ownerAddress;
    address[] public funders;
    uint256 public minimumUSD = 5 * 1e18;
    mapping(address => uint256) public fundersToAmount;
    AggregatorV3Interface public immutable priceFeed;

    constructor(address priceFeedAddress) {
        ownerAddress = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function FundMe() public payable {
        require(
            msg.value.GetEthInUsd(priceFeed) >= minimumUSD,
            "Not enough funds"
        );
        funders.push(msg.sender);
        fundersToAmount[msg.sender] += msg.value;
    }

    function withdraw() public payable OnlyOwner {
        (bool sendStatus, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(sendStatus, "Transaction failed");

        for (uint256 index = 0; index < funders.length; index++) {
            fundersToAmount[funders[index]] = 0;
        }

        funders = new address[](0);
    }

    modifier OnlyOwner() {
        require(
            msg.sender == ownerAddress,
            "Not authorised to call this function"
        );
        _;
    }

    receive() external payable {
        FundMe();
    }

    fallback() external {
        FundMe();
    }
}
