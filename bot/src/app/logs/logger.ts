import Bunyan from 'bunyan';
import bunyanLogstash from 'bunyan-logstash-tcp';

const logstashStream = bunyanLogstash.createStream({
 	host: 'logstash', 
	port: 5044
});

//расширяем класс под формирование ошибок
class ExtendedLogger extends Bunyan {
	logError(error: unknown, chatId?: any, tags: string[] = [], additionalInfo: Record<string, any> = {}) {
		console.log(error)
	  	const err = error instanceof Error ? error : new Error(String(error));
		this.error(JSON.stringify({
			message: err?.message,
			chatId: chatId,
			timestamp: new Date().toISOString().slice(0, 19),
			tags,
			stack: err?.stack,
			...additionalInfo,
		}));
	}
	logInfo(message:string,chatId?:any, tags: string[]=[]) {
		this.info(JSON.stringify({
			message:message,
			chatId:chatId,
			timestamp: new Date().toISOString().slice(0, 19),
			tags
		}))
	}
}

// Создаем логгер с двумя потоками: stdout и Logstash
const logger = new ExtendedLogger({
	name: 'bot',
	streams: [
		{
			level: 'info',
			stream: process.stdout  // Стандартный вывод в консоль
		},
		{
			level: 'info',
			stream: logstashStream  // Поток для отправки в Logstash
		}
	]
});

process.on('uncaughtException', (error) => {
	logger.logError(error, '', ['uncaughtException']);
});

process.on('unhandledRejection', (reason) => {
	logger.logError(reason, '', ['unhandledRejection']);
});
  

export default logger;