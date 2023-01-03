const networkCongig = {
    31337: {
        name: "localhost",
    },

    5: {
        name: "goerli",
        ethUsfPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    },
}

const INITIAL_SUPPLY = "1000000000000000000000000"

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkCongig,
    developmentChains,
    INITIAL_SUPPLY,
}
