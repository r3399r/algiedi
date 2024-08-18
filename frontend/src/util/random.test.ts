import { randomBase10, randomBase58 } from './random';

describe('random', () => {
  it('randomBase10', () => {
    const res = randomBase10(5);
    expect(res.length).toBe(5);
  });
  it('randomBase58', () => {
    const res = randomBase58(5);
    expect(res.length).toBe(5);
  });
});
