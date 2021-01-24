import chai, { expect } from 'chai';
import 'mocha';
import { findMid } from '@common/util/common';
import IntArrayUtil from '@common/util/IntArrayUtil';

before(async () => {
  // do nothing
});
after(async () => {
  // do nothing
});

describe('IntArrayUtils', () => {
  it('create', () => {
    expect(IntArrayUtil.create(0, 1)).deep.equal([]);
    expect(IntArrayUtil.create(1, 2)).deep.equal([2]);
    expect(IntArrayUtil.create(2, 3)).deep.equal([3, 3]);
  });
  it('create2D', () => {
    expect(IntArrayUtil.create2D(0, 0, 1)).deep.equal([]);
    expect(IntArrayUtil.create2D(1, 1, 9)).deep.equal([[9]]);
    expect(IntArrayUtil.create2D(1, 2, 9)).deep.equal([[9, 9]]);
    expect(IntArrayUtil.create2D(2, 1, 9)).deep.equal([[9], [9]]);
    expect(IntArrayUtil.create2D(3, 2, 9)).deep.equal([
      [9, 9],
      [9, 9],
      [9, 9],
    ]);
  });
  it('create3D', () => {
    expect(IntArrayUtil.create3D(0, 0, 0, 1)).deep.equal([]);
    expect(IntArrayUtil.create3D(1, 1, 1, 9)).deep.equal([[[9]]]);
    expect(IntArrayUtil.create3D(2, 4, 3, 9)).deep.equal([
      [
        [9, 9, 9],
        [9, 9, 9],
        [9, 9, 9],
        [9, 9, 9],
      ],
      [
        [9, 9, 9],
        [9, 9, 9],
        [9, 9, 9],
        [9, 9, 9],
      ],
    ]);
  });
  it('sum', () => {
    expect(IntArrayUtil.sum([])).equal(0);
    expect(IntArrayUtil.sum([4])).equal(4);
    expect(IntArrayUtil.sum([4, 8])).equal(12);
    expect(IntArrayUtil.sum([4, 8, 12])).equal(24);
  });
  it('count', () => {
    expect(IntArrayUtil.count([], 4)).equal(0);
    expect(IntArrayUtil.count([4], 4)).equal(1);
    expect(IntArrayUtil.count([4, 8], 4)).equal(1);
    expect(IntArrayUtil.count([4, 8, 12], 4)).equal(1);
    expect(IntArrayUtil.count([4, 8, 12, 4, 4, 4, 4, 1], 4)).equal(5);
    expect(IntArrayUtil.count([0, 4, 8, 12, 4, 4, 4, 4, 1], 4)).equal(5);
  });
});
