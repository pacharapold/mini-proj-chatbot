import { randInt } from '@common/util/common';

export default class {
  private sample: number[];

  constructor(public distribution: number[]) {
    this.sample = [];
    for (let idx = 0; idx < distribution.length; idx += 1) {
      for (let i = 0; i < distribution[idx]; i += 1) {
        this.sample.push(idx);
      }
    }
  }

  public getRandom(banNumbers?: number[]): number {
    while (true) {
      const v = this.sample[randInt(this.sample.length)];
      if (banNumbers && banNumbers.includes(v)) continue;
      return v;
    }
  }

  public toString(): string {
    return this.distribution.join(', ');
  }
}
