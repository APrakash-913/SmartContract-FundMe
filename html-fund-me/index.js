// in nodejs
// -> require()

// in front-end js :: Can't use require
// -> import
import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

console.log(ethers)

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
            console.log(error)
        }
        connectButton.innerHTML = "Connected!"
        const accounts = await ethereum.request({ method: "eth_accounts" })
        console.log(accounts)
    } else {
        fundButton.innerHTML = "Please Install METAMASK"
    }
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

// Fund
async function fund() {
    const ethAmounts = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmounts} ETH....`)
    /*  To create Fund fn we need;
            -> must have Metamask Account to connect with
            -> address of funder
            -> enough balance + gas
            => Contract to interact === ABI + address(contract)
    */
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        console.log(signer)
        const contract = new ethers.Contract(contractAddress, abi, signer) // ? --> we need ABI + Contract Address
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmounts),
            })
            // listen for the txn to be mined ✅
            // listen for the events <- not yet covered ❌
            await listenForTransactionMined(transactionResponse, provider)
            console.log("done")
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTransactionMined(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}....`)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        }) // provider.once(transactionResponse.hash, listener)
    })
    // ^ create a listener for blockchain
}

// withdraw
async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        console.log("Withdrawing....")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)

        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMined(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }
    }
}
