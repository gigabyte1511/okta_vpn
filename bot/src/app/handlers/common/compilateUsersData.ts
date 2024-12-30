import { getUser } from "../controllers/userController";

export const compilateSendMessageFromUsersData = async(userList:any[])=>{
    const aggregatedData: { [key: number]: any } = {};

    for (const user of userList) {
        try {
            const chatId = isNaN(Number(user.clientName.split("-")[0]))
            ? 0
            : Number(user.clientName.split("-")[0]);
            const vpnId = user.clientName.split("-")[1] || user.clientName;
            const clientInfo = await getUser(chatId);
        
            if (!aggregatedData[chatId]) {
            // Если chatId ещё нет, создаём запись
                aggregatedData[chatId] = {
                    name: clientInfo?.name || "Неизвестно",
                    telegramlink: clientInfo?.telegramlink || "Неизвестно",
                    telegramid: clientInfo?.telegramid || "Неизвестно",
                    vpnIds: [], // Список VPN IDs
                };
            }
        
            // Добавляем VPN ID и статус активности
            aggregatedData[chatId].vpnIds.push({
                id: vpnId,
                status: user.valid ? "Действующий" : "Просроченный",
            });
        } catch (e) {
            console.log(user.clientName);
        }
    }
    
    // Формируем итоговое сообщение
    let sendMessage = "";
    
    sendMessage += "📜 <b>Отчёт по пользователям:</b>\n\n";

    for (const [chatId, data] of Object.entries(aggregatedData)) {
      // Заголовок для каждого пользователя
      sendMessage += `🔹 <b>Чат ID:</b> ${chatId}\n`;
      sendMessage += `👤 <b>Имя:</b> ${data.name || "Неизвестно"}\n`;
      sendMessage += `🔗 <b>Ссылка:</b> ${data.telegramlink || "Неизвестно"}\n`;
      sendMessage += `📱 <b>Телеграм ID:</b> ${data.telegramid || "Неизвестно"}\n`;
    
      // Раздел для VPN
      sendMessage += `🌐 <b>VPN IDs:</b>\n`;
    
      if (data.vpnIds.length > 0) {
        for (const vpn of data.vpnIds) {
          sendMessage += `    🔑 <b>${vpn.id}:</b> ${vpn.status}\n`;
        }
      } else {
        sendMessage += `    🛑 Нет VPN записей.\n`;
      }
    
      sendMessage += `\n`; // Добавляем пустую строку между пользователями
    }
    
    return sendMessage;
}

