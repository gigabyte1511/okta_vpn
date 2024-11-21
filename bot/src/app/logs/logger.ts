import Bunyan from 'bunyan';
import bunyanLogstash from 'bunyan-logstash-tcp';

const logstashStream = bunyanLogstash.createStream({
 	host: 'logstash', 
	port: 5044
});

// Создаем логгер с двумя потоками: stdout и Logstash
const logger = new Bunyan({
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

export default logger;