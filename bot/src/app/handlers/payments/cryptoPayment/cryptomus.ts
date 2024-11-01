import md5 from 'md5';
import { createTransaction,getLastTransactionInformation,updateTransaction } from '../../controllers/transactionController';
import { generateOrderId } from '../common/generateOrderId';
import { PaymentStatus } from './paymentStateTypes';

class Cryptomus {
    private apiKey: string;
    private apiUrl: string;
    private merchant: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.apiUrl = "https://api.cryptomus.com/v1";
        this.merchant = "da9f82d8-4c54-46a2-a00a-12f13ce252f2";
    }

    private createSignature(data: object): string {
        const jsonData = JSON.stringify(data);
        const base64Data = Buffer.from(jsonData).toString('base64');
        return md5(base64Data + this.apiKey);
    }

    //создаем платеж
    async createPayment(amount: string, orderType: string, chatId:number) {
        const data = {
            amount: amount,
            order_id: generateOrderId(orderType),
            currency: "USDT",
        }

        const response = await fetch(`${this.apiUrl}/payment`, {
            method: 'POST',
            headers: {
                'merchant': this.merchant,
                'sign': this.createSignature(data),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const paymentResult = await response.json();

        if (paymentResult.state === 0){
            createTransaction(paymentResult.result.uuid, chatId, parseInt(paymentResult.result.amount, 10), "crypto", data.order_id);
        }
        
        return paymentResult.result.url;
    }

    //проверяем состояние выплаты
    async checkPayment(chatId: number) {
        const uuid = await getLastTransactionInformation(chatId,"id");
        const orderId =  await getLastTransactionInformation(chatId,"orderValue");
        if (typeof uuid === "string"){
            const data = {
                uuid:uuid,
                order_id:orderId
            }
    
            const response = await fetch(`${this.apiUrl}/payment/info`, {
                method: 'POST',
                headers: {
                    'merchant': this.merchant,
                    'sign': this.createSignature(data),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
    
            const paymentResponse = await response.json();
            const paymentStatus = paymentResponse.result.status as PaymentStatus;

            updateTransaction(uuid,{state:paymentStatus === PaymentStatus.Check});
            return paymentStatus;
        }
    }
}

export default Cryptomus;
