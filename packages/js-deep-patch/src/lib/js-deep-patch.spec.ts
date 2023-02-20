import { deepPatch } from './js-deep-patch';

describe('feepPatch', () => {
  it('should work', () => {
    const originalData = {
      user: { name: 'joe', brother: { name: 'jack' } },
      car: { id: 'AAA' },
    };

    const propsToUpdate = {
      user: { brother: undefined },
    };

    // Note: {...originalData, ...propsToUpdate} would remove result.user.name, which is not what we want
    const result = deepPatch(originalData, propsToUpdate);

    expect(result.user.brother).toBeUndefined();
    expect(result.user.name).toBeDefined();
    expect(result.car).toBeDefined();
  });
});
