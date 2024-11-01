import winston from 'winston';

const logstashTransport = new winston.transports.Http({
    host: 'localhost',
    port: 5044,
    path: '/',
    ssl: false
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'combined.log' }),
        logstashTransport,
    ],
});

export default logger;