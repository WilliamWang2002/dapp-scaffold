import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
    Keypair,
    SystemProgram,
    Transaction,
    TransactionSignature,
} from "@solana/web3.js";
import { FC, useCallback, useState } from "react";
import { notify } from "../utils/notifications";

export const SendTransaction: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [amount, setAmount] = useState<number>();
    const [receiverAddress, setReceiverAddress] = useState("");

    const onClick = useCallback(async () => {
        if (!publicKey) {
            notify({ type: "error", message: `Wallet not connected!` });
            console.log("error", `Send Transaction: Wallet not connected!`);
            return;
        }

        let signature: TransactionSignature = "";
        try {
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: Keypair.generate().publicKey,
                    lamports: 1_000_000,
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

    const onChange = (e) => {
        setAmount(e.currentTarget.value);
    }

    return (
        <div className="flex w-full flex-col gap-4 rounded-lg bg-base-300 p-4 shadow-lg">
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">Amount</span>
                </label>
                <input
                    className="input-bordered input w-full"
                    onChange={onChange}
                    placeholder="Enter amount"
                    step={0.001}
                    type="number"
                    value={amount}
                />
            </div>
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">Receiver Address</span>
                </label>
                <input
                    className="input-bordered input w-full"
                    onChange={(e) => setReceiverAddress(e.target.value)}
                    placeholder="Enter address"
                    type="text"
                    value={receiverAddress}
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
