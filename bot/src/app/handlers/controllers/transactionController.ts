import Transaction from "../../models/Transaction";
import { TransactionKey } from "../../types";


export async function getLastTransactionInformation(userId:number,type:TransactionKey){
    const transaction = await Transaction.query().findOne("user_id",userId).orderBy("created_at", "desc") .first();
    if (transaction){
        return transaction[type]
    }
}

export async function createTransaction(transactionId:string, userId: number, amount: number, type:"telegram" | "crypto", orderValue:string) {
    const transaction: Transaction = await Transaction.query().insert({id:transactionId, user_id:userId, amount: amount,type: type, orderValue: orderValue});
    return transaction;
}

export async function updateTransaction(transactionId: string, data: Partial<Transaction>) {
    const updatedTransaction = await Transaction.query()
        .patchAndFetchById(transactionId, data);
    return updatedTransaction;
}