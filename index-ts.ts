import { 
    createWalletClient, 
    custom, 
    createPublicClient, 
    formatEther, 
    parseEther, 
    defineChain, 
    PublicClient,
    WalletClient,
    Hash
} from "viem";
import "viem/window"
import { abi, contractAddress } from "./constants-ts";

const connectButton = document.getElementById("connectButton") as HTMLButtonElement;
const fundButton = document.getElementById("fundButton") as HTMLButtonElement;
const ethAmountInput = document.getElementById("ethAmount") as HTMLInputElement;
const balanceButton = document.getElementById("balanceButton") as HTMLButtonElement;
const withdrawButton = document.getElementById("withdrawButton") as HTMLButtonElement;

console.log("asdsad");

let walletClient: WalletClient;
let publicClient: PublicClient;
const coffeeAbi = abi;

async function connect(): Promise<void> {
    if (typeof window.ethereum !== "undefined") {
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        });
        await walletClient.requestAddresses();
        connectButton.innerHTML = "Connected";
    } else {
        connectButton.innerHTML = "Please install Metamask!";
    }
}

async function fund(): Promise<void> {
    const ethAmount = ethAmountInput.value;
    console.log(`Funding with ${ethAmount}...`);

    if (typeof window.ethereum !== "undefined") {
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        });
        const [connectedAccount] = await walletClient.requestAddresses();
        const currentChain = await getCurrentChain(walletClient);
        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        });
        const { request } = await publicClient.simulateContract({
            address: contractAddress,
            abi: coffeeAbi,
            functionName: "fund",
            account: connectedAccount,
            chain: currentChain,
            value: parseEther(ethAmount)
        });

        const txHash : Hash = await walletClient.writeContract(request);
        console.log("Transaction hash: ", txHash);
    } else {
        connectButton.innerHTML = "Please install Metamask!";
    }
}

async function withdraw(): Promise<void> {
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

        const { request } = await publicClient.simulateContract({
            address: contractAddress,
            abi: coffeeAbi,
            functionName: "withdraw",
            account: connectedAccount,
            chain: currentChain
        });

        const txHash : Hash = await walletClient.writeContract(request);
        console.log("Transaction hash: ", txHash);
    } else {
        connectButton.innerHTML = "Please install Metamask!";
    }
}

async function getBalance(): Promise<void> {
    if (typeof window.ethereum !== "undefined") {
        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        });
        const balance = await publicClient.getBalance({
            address: contractAddress
        });
        console.log(formatEther(balance));
    }
}

async function getCurrentChain(client: ReturnType<typeof createWalletClient>): Promise<ReturnType<typeof defineChain>> {
    const chainId = await client.getChainId();
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
    });
    return currentChain;
}

connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;