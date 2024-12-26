import Transaction from "../../models/Transaction";
import { TransactionKey } from "../../types";


export async function getLastTransactionByParameter(chatId:number,type:TransactionKey){
    const transaction = await Transaction.query().findOne("chat_id",chatId).orderBy("created_at", "desc") .first();
    if (transaction){
        return transaction[type]
    }
}

export async function getLastTransaction(chatId: number) {
    const transaction = await Transaction.query().findOne("chat_id", chatId).orderBy("created_at", "desc").first();
    return transaction || null;
}

export async function createTransaction(transactionId:string, chatId: number, amount: number, type:"telegram" | "crypto", orderValue:string) {
    const transaction: Transaction = await Transaction.query().insert({id:transactionId, chat_id:chatId, amount: amount,type: type, orderValue: orderValue});
    return transaction;
}

export async function updateTransaction(transactionId: string, data: Partial<Transaction>) {
    const updatedTransaction = await Transaction.query()
        .patchAndFetchById(transactionId, data);
    return updatedTransaction;
}

export async function deleteTransaction(orderValue: string) {
    const transaction = await Transaction.query().findOne("orderValue", orderValue).first().delete();
    return transaction;
}