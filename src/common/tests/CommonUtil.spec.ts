import chai, { expect } from 'chai';
import 'mocha';
import { findMid } from '@common/util/common';

before(async () => {
  // do nothing
});
after(async () => {
  // do nothing
});

describe('findMid', () => {
  it('not found', () => {
    chai.assert.throw(() => findMid(' abcdefghi ', 'bc', 'ij'), Error);
    chai.assert.throw(() => findMid(' abcdefghi ', 'bd', 'gh'), Error);
    expect(findMid(' abcdefghi ', 'bc', 'gh')).equal('def');
    expect(findMid(' abcdefghi ', ' ', 'a')).equal('');
    expect(findMid(' abcdefghiabc ', 'cd', 'ab')).equal('efghi');
  });
});
