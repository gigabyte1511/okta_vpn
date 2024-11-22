//существующие колбеки на кнопках
export enum Callback {
    SUBSCRIPTION_LIST = "subscription_sist",
    SUBSCRIPTION_CONFIRMATION = "subscription_confirmation",
    SUBSCRIPTION_SELECTED = "subscription_selected",
    PAYMENT = "payment",
    PURCHASE_OFFER = "purchase offer",
    GET_CONFIG = "get_config",
    GET_PAYMENT_STATUS = "get_transaction_status"
}

//варианты подписки
export enum SubscriptionOption {
    MONTH_1 = "1",
    MONTH_2 = "2",
    MONTH_6 = "6",
    MONTH_12 = "12",
}

//суммы на оплату в копейках
enum SubscriptionPrices {
    MONTH_1 = 19900,
    MONTH_2 = 35000,
    MONTH_6 = 110000,
    MONTH_12 = 200000,
}

//матрица соответствий цена - подписка
export const subscriptionPricesMap: Record<SubscriptionOption, SubscriptionPrices> = {
    [SubscriptionOption.MONTH_1]: SubscriptionPrices.MONTH_1,
    [SubscriptionOption.MONTH_2]: SubscriptionPrices.MONTH_2,
    [SubscriptionOption.MONTH_6]: SubscriptionPrices.MONTH_6,
    [SubscriptionOption.MONTH_12]: SubscriptionPrices.MONTH_12,
};

//тип ПС
type TypePayment = 'telegram' | 'equiring' | 'crypto';
export interface Payment {
    name: string;
    token: string;
    type: TypePayment;
}

//матрица объекта транзакции
export type TransactionValueMap = {
    id: string;
    amount: number;
    state: boolean;
    type: string;
    orderValue: string;
};

export type TransactionKey = keyof TransactionValueMap;
export type TransactionValue = TransactionValueMap[TransactionKey];

//конфиг бота
export interface BotConfig {
    token: string;
    payment: Payment[];
    supportURL: string;
}
export interface ApiConfig {
    baseURL: string;
}