import { sleep } from '@common/util/common';

export interface FailSleepConfig {
  startSleep: number;
  incrementSleep: number;
  maxSleep: number;
}

export default class FailSleep {
  public config: FailSleepConfig;
  public errorCount: number = 0;

  public constructor(config?: FailSleepConfig) {
    this.config = config ?? {
      startSleep: 5000,
      incrementSleep: 15000,
      maxSleep: 60000,
    };
  }

  public reset(): void {
    this.errorCount = 0;
  }

  public async sleep() {
    this.errorCount++;
    let ms =
      this.config.startSleep +
      (this.errorCount - 1) * this.config.incrementSleep;
    if (ms < 0) ms = 0;
    if (ms > this.config.maxSleep) ms = this.config.maxSleep;
    console.log(`failSleep #${this.errorCount} ${ms} ms`);
    await sleep(ms);
  }
}
