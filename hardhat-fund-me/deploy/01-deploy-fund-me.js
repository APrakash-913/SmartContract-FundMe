const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
/*
ABOVE is same as
const helperConfig = require("../helper-hardhat-config")
const networkConfig = helperConfig.networkConfig
*/

const { verify } = require("../utils/verify")
require("dotenv").config()

/**
 * async function deployFunc(hre) {
 *      #CODES...
 * }
 *
 * module.exports.default = deployFunc
 * @param {way 1} param1
 */

/**
 * module.exports = async (hre) => {
 *      const{getNamedAccounts, deployments} = hre
 *      // Above is simlilar to === hre.getNamedAccounts || hre.deployments
 * }
 * @param {Way 2} param2
 */

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let ethUsdPriceFeedAddress
    if (chainId == 31337) {
        // localhost OR Hardhat
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    log("----------------------------------------------------")
    log("Deploying FundMe and waiting for confirmations...")

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`FundMe deployed at ${fundMe.address}`)

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, [ethUsdPriceFeedAddress]) // Verifing the contracts IF we're deploying in ONLINE TESTNET
    }
}

module.exports.tags = ["all", "fundme"]
