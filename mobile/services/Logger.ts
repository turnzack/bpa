export type LogType = 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO' | 'DEBUG';

export interface Log {
    timestamp: string;
    type: LogType;
    message: string;
}

class LoggerService {
    private logs: Log[] = [];

    constructor() {
        // Add some dummy logs for initial view
        this.info("Application initialized");
        this.success("Logger service ready");
    }

    log(type: LogType, message: string) {
        const timestamp = new Date().toLocaleTimeString();
        this.logs.unshift({ timestamp, type, message });
        if (this.logs.length > 200) this.logs.pop();
    }

    info(msg: string) { this.log('INFO', msg); }
    error(msg: string) { this.log('ERROR', msg); }
    success(msg: string) { this.log('SUCCESS', msg); }
    warning(msg: string) { this.log('WARNING', msg); }
    debug(msg: string) { this.log('DEBUG', msg); }

    getRecentLogs(limit: number = 50) {
        return this.logs.slice(0, limit);
    }

    getStats() {
        return {
            total: this.logs.length,
            success: this.logs.filter(l => l.type === 'SUCCESS').length,
            warning: this.logs.filter(l => l.type === 'WARNING').length,
            info: this.logs.filter(l => l.type === 'INFO').length,
            error: this.logs.filter(l => l.type === 'ERROR').length,
        }
    }
}

export const Logger = new LoggerService();
