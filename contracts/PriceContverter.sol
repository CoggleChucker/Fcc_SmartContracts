//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library GetEthPrice {
    function GetUSDPrice(
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        /**
         * Network: Goerli
         * Aggregator: ETH/USD
         * Address: 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
         */

        AggregatorV3Interface ethTousd = priceFeed;
        (, int256 price, , , ) = ethTousd.latestRoundData();

        return uint256(price * 1e10);
    }

    function GetEthInUsd(
        uint256 _amount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 EthPrice = GetUSDPrice(priceFeed);
        return ((_amount * EthPrice) / 1e18);
    }
}
