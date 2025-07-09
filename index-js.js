// viem javascript blockchain tool
// can connect diffrent types wallet in the future
import { createWalletClient, custom, createPublicClient, formatEther, parseEther, defineChain} from "https://esm.sh/viem"
import { abi, contractAddress } from "./constants-js.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const ethAmountInput = document.getElementById("ethAmount")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")

let walletClient
let publicClient
let coffeeAbi = abi

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        })
        await walletClient.requestAddresses()
        connectButton.innerHTML = "Connected"
    } else {
        connectButton.innerHTML = "Please install Metamask!"
    }
}

async function fund() {
    const ethAmount = ethAmountInput.value
    console.log(`Funding with ${ethAmount}...`)

    if (typeof window.ethereum !== "undefined") {
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        })
        const [connectedAccount] = await walletClient.requestAddresses()
        const currentChain = await getCurrentChain(walletClient)
        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        })
        const {request} = await publicClient.simulateContract({
            address: contractAddress,
            abi: coffeeAbi,
            functionName: "fund",
            account: connectedAccount,
            chain: currentChain,
            value: parseEther(ethAmount)
        })
        
        const hash = await walletClient.writeContract(request)
        console.log("tx hash: ", hash)
    } else {
        connectButton.innerHTML = "Please install Metamask!"
    }
}

async function withdraw() {
    console.log("Withdrawing funds...");

    if (typeof window.ethereum !== "undefined") {
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        });
        const [connectedAccount] = await walletClient.requestAddresses();
        const currentChain = await getCurrentChain(walletClient);
        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        });

        const {request} = await publicClient.simulateContract({
            address: contractAddress,
            abi: coffeeAbi,
            functionName: "withdraw",
            account: connectedAccount,
            chain: currentChain
        });
        
        const hash = await walletClient.writeContract(request);
        console.log("Transaction hash: ", hash);
    } else {
        connectButton.innerHTML = "Please install Metamask!";
    }
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        })
        const balance = await publicClient.getBalance({
            address: contractAddress
        })
        console.log(formatEther(balance))
    }
}

async function getCurrentChain(client) {
  const chainId = await client.getChainId()
  const currentChain = defineChain({
    id: chainId,
    name: "Custom Chain",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ["http://localhost:8545"],
      },
    },
  })
  return currentChain
}

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw