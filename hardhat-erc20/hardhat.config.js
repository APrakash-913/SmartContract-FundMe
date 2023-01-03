require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const POLYGON_MAINNET_RPC_URL = process.env.POLYGON_MAINNET_RPC_URL
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY

module.exports = {
    solidity: {
        compilers: [{ version: "0.8.7" }, { version: "0.4.24" }],
    },
    networks: {
        hardhat: {
            chainId: 31337,
        },

        localhost: {
            chainId: 31337,
        },

        goerli: {
            chainId: 5,
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
        },

        polygon: {
            chainId: 137,
            url: POLYGON_MAINNET_RPC_URL,
            accounts: [PRIVATE_KEY],
        },
    },

    etherscan: {
        apikey: {
            goerli: ETHERSCAN_API_KEY,
        },
    },

    namedAccounts: {
        deployer: {
            default: 0,
        },

        user: {
            default: 1,
        },
    },

    gasReporter: {
        noColors: true,
        outputfile: "gas-report.txt",
        enabled: true,
        currency: "USD",
        coinmarketcap: COINMARKETCAP_API_KEY,
    },

    mocha: {
        timeout: 200000, // 200 seconds max. running time
    },
}
