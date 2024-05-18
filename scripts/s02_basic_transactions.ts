// To run:
// npx ts-node scripts/s02_basic_transactions.ts

import * as dotenv from "dotenv";
dotenv.config();

import {
    Wallet as ZkWallet,
    Provider as ZkProvider,
    utils as Zkutils,
} from "zksync-ethers";
import { ethers } from "ethers";

// Main script
async function main() {
    // Define contract addresses
    const TCRO_L1_ADDRESS = process.env.TCRO_L1_ADDRESS!;
    const ZKTCRO_L1_ADDRESS = process.env.ZKTCRO_L1_ADDRESS!;
    const ZKTCRO_L2_ADDRESS = process.env.ZKTCRO_L2_ADDRESS!;

    // Define providers and wallets
    const l1Provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_SEPOLIA_URL);
    const l2Provider = new ZkProvider(process.env.CRONOS_ZKEVM_URL!);
    const l1Wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY!, l1Provider);
    const l2Wallet = new ZkWallet(process.env.WALLET_PRIVATE_KEY!, l2Provider, l1Provider);
    const recipient = process.env.WALLET_ADDRESS!;

    // Define empty variables with type
    let amountETH: string;
    let amountWei: bigint;
    let tx: ethers.TransactionResponse
    let txReceipt: ethers.TransactionReceipt | null;
    let gasUsed: bigint;
    let gasPrice: bigint;
    let txFeeWei: bigint;
    let txFee: string;

    // Send zkTCRO to recipient
    // In the zksync-ethers library, for convenience, the Wallet class has a transfer method,
    // which can transfer ETH or any ERC20 token within the same interface.
    // console.log("\nSending zkTCRO to recipient: ", recipient, "...")
    // amountETH = "0.01";
    // amountWei = ethers.parseEther(amountETH);
    // tx = await l2Wallet.transfer({to: recipient, amount: amountWei});
    // console.log("Transaction created:", tx.hash);
    // txReceipt = await tx.wait();
    // if (txReceipt) {
    //     console.log("Transaction included on L2 in block:", txReceipt.blockNumber);
    //     gasUsed = txReceipt.gasUsed;
    //     gasPrice = txReceipt.gasPrice;
    //     txFeeWei = gasUsed * gasPrice;
    //     txFee = ethers.formatUnits(txFeeWei, "ether");
    //     console.log("Transaction fee:", txFee, "zkTCRO");
    // }

    // Deposit zkTCRO from L1 to L2
    amountETH = "0.01";
    amountWei = ethers.parseEther(amountETH);
    tx = await l2Wallet.deposit({
        token: ZKTCRO_L1_ADDRESS,
        amount: amountWei,
        to: l2Wallet.address,
        approveERC20: true,
    });
    txReceipt = await tx.wait();
    if (txReceipt) {
        console.log("Transaction included on L2 in block:", txReceipt.blockNumber);
        gasUsed = txReceipt.gasUsed;
        gasPrice = txReceipt.gasPrice;
        txFeeWei = gasUsed * gasPrice;
        txFee = ethers.formatUnits(txFeeWei, "ether");
        console.log("Transaction fee:", txFee, "zkTCRO");
    }
}

main().catch(console.error);