import TelegramBot from 'node-telegram-bot-api';
import config from "config";
const botConfig = config.get("bot");

export const bot = new TelegramBot(botConfig.token, { polling: true });

const chatIds = [
  122150105, 125224913, 1325895547, 1454367205,
  1929767513, 487768250, 554386866, 581384480, 855749782
];

async function processChats(chatIds) {
  for (const chatId of chatIds) {
    try {
      // Получаем данные о чате
      const chat = await bot.getChat(chatId);

      // Извлекаем данные
      const userId = chat.id || 0; // ID пользователя/чата
      const userLink = chat.username ? `https://t.me/${chat.username}` : ''; // Ссылка на профиль
      const fullName = [chat.first_name, chat.last_name].filter(Boolean).join(' '); // Полное имя

      // Добавляем/обновляем данные в БД
      await knex("users")
        .insert({
          id: chatId,
          name: fullName,
          telegramid: userId,
          telegramlink: userLink,
        })
        .onConflict("id") // Если запись с таким ID уже существует
        .merge(); // Обновляем поля, если запись найдена

      console.log(`Chat ${chatId} processed successfully.`);
    } catch (err) {
      console.error(`Error processing chat ${chatId}:`, err.message);
    }
  }
}

// Запуск обработки
processChats(chatIds);