declare module 'bunyan-logstash-tcp' {
    import { Writable } from 'stream';

    interface LogstashStreamOptions {
        host: string;
        port: number;
    }

    export function createStream(options: LogstashStreamOptions): Writable;
}
