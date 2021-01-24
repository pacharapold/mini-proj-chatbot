import { expect } from 'chai';
import 'mocha';
import NumberDistributor from '@common/util/NumberDistributor';
import IntArrayUtil from '@common/util/IntArrayUtil';

before(async () => {
  // do nothing
});
after(async () => {
  // do nothing
});

describe('NumberDistributor', () => {
  it('distribution', () => {
    const dist = new NumberDistributor([10, 20, 30, 1000, 10, 50]);
    const result: number[] = [];
    for (let i = 0; i < 10000; i += 1) result.push(dist.getRandom());
    expect(IntArrayUtil.count(result, 3) > 7000).to.be.true;
  });
  it('ban', () => {
    const dist = new NumberDistributor([10, 20, 30, 10, 150]);
    const result: number[] = [];
    for (let i = 0; i < 1000; i += 1) result.push(dist.getRandom([0, 1, 2, 4]));
    expect(IntArrayUtil.count(result, 3) === 1000).to.be.true;
  });
});
