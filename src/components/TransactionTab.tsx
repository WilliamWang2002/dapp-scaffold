import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
    TransactionSignature,
} from "@solana/web3.js";
import { FC, useCallback, useState } from "react";
import { notify } from "../utils/notifications";

export const TransactionTab: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [amount, setAmount] = useState<number>();
    const [receiverAddressString, setReceiverAddress] = useState("");
    console.log(receiverAddressString);
   

    const onClick = useCallback(async () => {
        if (!publicKey) {
            notify({ type: "error", message: `Wallet not connected!` });
            console.log("error", `Send Transaction: Wallet not connected!`);
            return;
        }

        let signature: TransactionSignature = "";
        try {
            // const receiverAddress = new PublicKey(receiverAddressString);
            // console.log(receiverAddress);
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: Keypair.generate().publicKey,
                    lamports: amount * LAMPORTS_PER_SOL,
                })
            );

            signature = await sendTransaction(transaction, connection);

            await connection.confirmTransaction(signature, "confirmed");
            notify({
                type: "success",
                message: "Transaction successful!",
                txid: signature,
            });
        } catch (error: any) {
            notify({
                type: "error",
                message: `Transaction failed!`,
                description: error?.message,
                txid: signature,
            });
            console.log(
                "error",
                `Transaction failed! ${error?.message}`,
                signature
            );
            return;
        }
    }, [publicKey, notify, connection, sendTransaction]);

    return (
        <div className="flex w-full flex-col gap-4 rounded-lg bg-base-300 p-4 shadow-lg">
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">Amount</span>
                </label>
                <input
                    className="input-bordered input w-full"
                    onChange={(e) => setAmount(parseFloat(e.currentTarget.value))}
                    placeholder="Enter amount"
                    step={0.001}
                    value={amount}
                />
            </div>
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">Receiver Address</span>
                </label>
                <input
                    className="input-bordered input w-full"
                    onChange={(e) => {
                        console.log(e.currentTarget.value);
                        setReceiverAddress(e.currentTarget.value)}}
                    placeholder="Enter address"
                    type="text"
                />
            </div>
            <div>
                <button
                    className="group w-60 m-2 btn animate-pulse disabled:animate-none bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ... "
                    onClick={onClick}
                    disabled={!publicKey}>
                    <div className="hidden group-disabled:block ">
                        Wallet not connected
                    </div>
                    <span className="block group-disabled:hidden">
                        Send Transaction
                    </span>
                </button>
            </div>
        </div>
    );
};
// 9cKyRKHMywHZqny16GSXEMkCKQGCVkAgXziXyJiaoUVM
// CUW96kfnTBVJmxeefXyqqaMq3Szk8cJw94dB7rEBAbk7