function create(size: number, v: number): number[] {
  // tslint:disable-next-line: prefer-array-literal
  return new Array<number>(size).fill(v);
}

function create2D(size0: number, size1: number, v: number): number[][] {
  const result: number[][] = [];
  for (let i = 0; i < size0; i++) {
    result.push(create(size1, v));
  }
  return result;
}

function create3D(
  size0: number,
  size1: number,
  size2: number,
  v: number,
): number[][][] {
  const result: number[][][] = [];
  for (let i = 0; i < size0; i++) {
    const arr: number[][] = [];
    for (let j = 0; j < size1; j++) {
      arr.push(create(size2, v));
    }
    result.push(arr);
  }
  return result;
}

function sum(arr: number[]) {
  return arr.reduce((v, x) => v + x, 0);
}

function count(arr: number[], v: number) {
  let result = 0;
  for (const c of arr) if (c === v) result += 1;
  return result;
}

export default {
  create,
  create2D,
  create3D,
  sum,
  count,
};
