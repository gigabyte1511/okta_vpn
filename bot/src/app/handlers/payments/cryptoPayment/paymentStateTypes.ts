export enum PaymentStatus {
    Paid = "paid", // Платеж прошел успешно, и клиент заплатил ровно столько, сколько требовалось
    PaidOver = "paid_over", // Платеж прошел успешно, и клиент заплатил больше, чем требовалось
    WrongAmount = "wrong_amount", // Клиент заплатил меньше, чем требовалось
    Process = "process", // Платеж в процессе обработки
    ConfirmCheck = "confirm_check", // Транзакция видна в блокчейне, ждем подтверждений
    WrongAmountWaiting = "wrong_amount_waiting", // Клиент заплатил меньше, чем требовалось, возможна доплата
    Check = "check", // Ожидание появления транзакции в блокчейне
    Fail = "fail", // Ошибка при оплате
    Cancel = "cancel", // Платеж отменен, клиент не оплатил
    SystemFail = "system_fail", // Произошла системная ошибка
    RefundProcess = "refund_process", // Возврат средств обрабатывается
    RefundFail = "refund_fail", // Ошибка во время возврата средств
    RefundPaid = "refund_paid", // Возврат средств прошел успешно
    Locked = "locked" // Средства заблокированы из-за программы AML
}