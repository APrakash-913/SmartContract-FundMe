const { verify } = require("../utils/verify")
const { network } = require("hardhat")
const {
    developmentChains,
    INITIAL_SUPPLY,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const ourToken = deploy("OurToken", {
        from: deployer,
        args: [],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`ourToken deployed at ${ourToken.address}`)

    // Verification Process

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(ourToken.address, [INITIAL_SUPPLY])
    }
}

module.exports.tags = ["all", "token"]
