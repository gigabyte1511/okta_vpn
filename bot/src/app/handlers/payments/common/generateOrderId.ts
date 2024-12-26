export function generateOrderId(month:string): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-';
    const length = 15;
    let orderId = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        orderId += chars[randomIndex];
    }
    
    return `${JSON.stringify({month:month,ident:orderId})}`;
}