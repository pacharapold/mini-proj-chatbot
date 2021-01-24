/**
 * Setup the winston logger.
 *
 * Documentation: https://github.com/winstonjs/winston
 */
// tslint:disable: unified-signatures
// tslint:disable: no-console
// tslint:disable: no-string-literal
import { createLogger, format, Logger, transports, loggers } from 'winston';
import {
  ElasticsearchTransport,
  ElasticsearchTransportOptions,
} from 'winston-elasticsearch';

const { Console } = transports;

import path from 'path';
const PROJECT_ROOT = path.join(__dirname, '..');
/**
 * Parses and returns info about the call stack at the given index.
 */
function getStackInfo(stackIndex: number) {
  // get call stack, and analyze it
  // get all file, method, and line numbers
  const stacklist = new Error().stack!.split('\n').slice(3);

  // stack trace format:
  // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
  // do not remove the regex expresses to outside of this method (due to a BUG in node.js)
  const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
  const stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi;

  const s = stacklist[stackIndex] || stacklist[0];
  const sp = stackReg.exec(s) || stackReg2.exec(s);

  if (sp && sp.length === 5) {
    return {
      method: sp[1],
      relativePath: path.relative(PROJECT_ROOT, sp[2]),
      line: sp[3],
      pos: sp[4],
      file: path.basename(sp[2]),
      stack: stacklist.join('\n'),
    };
  }
}

export interface ILogServiceConfig {
  elkHost: string;
  defaultMeta: any;
}
export default class LogService {
  private logger: Logger;

  constructor({ elkHost, defaultMeta }: ILogServiceConfig) {
    // Init Logger
    const logger = createLogger({
      defaultMeta,
      level:
        process.env.NODE_ENV === 'production' ||
        process.env.NODE_ENV === 'development'
          ? 'info'
          : 'debug',
    });
    this.logger = logger;
    this.initialTransport(elkHost);
  }

  private initialTransport(node: string) {
    /**
     * For production and development write to all logs with level `info` and below
     * to `combined.log. Write all logs error (and below) to `error.log`.
     * For local, print to the console.
     */
    if (
      process.env.NODE_ENV === 'production' ||
      process.env.NODE_ENV === 'development'
    ) {
      const logFormat = format.combine(format.timestamp(), format.json());

      const esTransportOpts: ElasticsearchTransportOptions = {
        format: logFormat,
        clientOpts: {
          node,
        },
        elasticsearchVersion: 6,
        transformer: logData => {
          return {
            '@timestamp': logData.timestamp,
            severity: logData.level,
            message: logData.message,
            module: logData.meta['module'],
            fields: {
              ...logData.meta,
            },
          };
        },
      };
      const winstonTransport = new ElasticsearchTransport(esTransportOpts);

      this.logger.add(winstonTransport);
    } else {
      const errorStackFormat = format(info => {
        if (info.stack) {
          console.log(info.stack);
          return false;
        }
        return info;
      });
      const consoleTransport = new Console({
        format: format.combine(
          format.colorize(),
          format.simple(),
          errorStackFormat(),
        ),
      });
      this.logger.add(consoleTransport);
    }
  }

  public info(object: any): void;
  public info(message: string): void;
  public info(message: string, object: any): void;
  public info(msgOrObject: string | any, object?: any): void {
    const stackInfo = getStackInfo(0);
    if (object !== undefined) {
      console.log(
        `[${stackInfo?.relativePath}:${stackInfo?.line}] ${msgOrObject}`,
        object,
      );
    } else if (typeof msgOrObject === 'object') {
      console.log(
        `[${stackInfo?.relativePath}:${stackInfo?.line}]`,
        msgOrObject,
      );
    } else {
      console.log(
        `[${stackInfo?.relativePath}:${stackInfo?.line}] ${msgOrObject}`,
      );
    }
  }

  public error(object: any): void;
  public error(message: string): void;
  public error(message: string, object: any): void;
  public error(msgOrObject: string | any, object?: any): void {
    const stackInfo = getStackInfo(0);
    if (object !== undefined) {
      console.log(
        `[${stackInfo?.relativePath}:${stackInfo?.line}] ${msgOrObject}`,
        object,
      );
    } else if (typeof msgOrObject === 'object') {
      console.log(
        `[${stackInfo?.relativePath}:${stackInfo?.line}]`,
        msgOrObject,
      );
    } else {
      console.log(
        `[${stackInfo?.relativePath}:${stackInfo?.line}] ${msgOrObject}`,
      );
    }
  }

  public warn(object: any): void;
  public warn(message: string): void;
  public warn(message: string, object: any): void;
  public warn(msgOrObject: string | any, object?: any): void {
    const stackInfo = getStackInfo(0);
    if (object !== undefined) {
      this.logger.warn(
        `[${stackInfo?.relativePath}:${stackInfo?.line}] ${msgOrObject}`,
        object,
      );
    } else if (typeof msgOrObject === 'object') {
      this.logger.warn(
        `[${stackInfo?.relativePath}:${stackInfo?.line}]`,
        msgOrObject,
      );
    } else {
      this.logger.warn(
        `[${stackInfo?.relativePath}:${stackInfo?.line}] ${msgOrObject}`,
      );
    }
  }

  public debug(object: any): void;
  public debug(message: string): void;
  public debug(message: string, object: any): void;
  public debug(msgOrObject: string | any, object?: any): void {
    const stackInfo = getStackInfo(0);
    if (object !== undefined) {
      this.logger.debug(
        `[${stackInfo?.relativePath}:${stackInfo?.line}] ${msgOrObject}`,
        object,
      );
    } else if (typeof msgOrObject === 'object') {
      this.logger.debug(
        `[${stackInfo?.relativePath}:${stackInfo?.line}]`,
        msgOrObject,
      );
    } else {
      this.logger.debug(
        `[${stackInfo?.relativePath}:${stackInfo?.line}] ${msgOrObject}`,
      );
    }
  }

  public getLogger(): Logger {
    return this.logger;
  }
}
