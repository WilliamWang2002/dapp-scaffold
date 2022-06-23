import type { NextPage } from "next";
import Head from "next/head";
import { TransactionView } from "../views/transaction";

const Transaction: NextPage = (props) => {
    return (
        <div>
            <Head>
                <title>Solana Scaffold</title>
                <meta name="description" content="Solana Scaffold" />
            </Head>
            <TransactionView />
        </div>
    );
};

export default Transaction;
