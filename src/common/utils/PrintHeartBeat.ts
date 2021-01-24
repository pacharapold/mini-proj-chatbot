export default class PrintHeartBeat {
  private lastPrintTstamp = 0;
  private countInLine = 0;
  private lastPrintStr = '';

  public constructor(
    private beatPeriod: number,
    private maxBeatPerLine: number,
  ) {}

  public reset() {
    this.lastPrintTstamp = 0;
    this.countInLine = 0;
  }

  public print(c: string) {
    const now = Date.now();
    if (
      c !== this.lastPrintStr ||
      now > this.lastPrintTstamp + this.beatPeriod
    ) {
      this.lastPrintStr = c;
      if (this.countInLine >= this.maxBeatPerLine) {
        process.stdout.write('\n');
        this.countInLine = 0;
      }
      process.stdout.write(c);
      this.lastPrintTstamp = now;
      this.countInLine++;
    }
  }
}
