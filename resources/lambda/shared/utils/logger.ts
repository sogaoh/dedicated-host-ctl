export class Logger {
    static log(message: string, ...args: any[]) {
        console.log(`[LOG] ${message}`, ...args);
    }
    static error(message: string, ...args: any[]) {
        console.error(`[ERROR] ${message}`, ...args);
    }
}
