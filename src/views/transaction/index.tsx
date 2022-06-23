import { FC, useEffect, useState } from "react";
import { SignMessage } from "../../components/SignMessage";
import { SendTransaction } from "../../components/SendTransaction";
import useUserSOLBalanceStore from "stores/useUserSOLBalanceStore";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { TransactionTab } from "components/TransactionTab";

export const TransactionView: FC = ({}) => {
    const connection = new Connection(clusterApiUrl("devnet"));
    const { publicKey } = useWallet();
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        if (!connection || !publicKey) {
            return;
        }
        connection.getAccountInfo(publicKey).then((info) => {
            if (info) {
                setBalance(info.lamports);
            }
        });
    }, [connection, publicKey]);

    return (
        <div className="md:hero mx-auto p-4">
            <div className="md:hero-content flex flex-col">
                <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
                    Transaction
                </h1>
                {/* CONTENT GOES HERE */}
                <p>
                    {publicKey
                        ? `Current Balance: ${balance / LAMPORTS_PER_SOL} SOL`
                        : ""}
                </p>
                <div className="text-center">
                    <TransactionTab />
                </div>
            </div>
        </div>
    );
};
