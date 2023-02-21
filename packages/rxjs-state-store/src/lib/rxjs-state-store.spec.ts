import { StateStore } from './rxjs-state-store';

describe('rxjsStateStore', () => {
  it('StateStore with a number', () => {
    // With number
    const numberStore = new StateStore(1);
    const spy = jest.fn();
    numberStore.value$.subscribe(spy);
    expect(spy).toHaveBeenCalledWith(1);

    numberStore.update(2);
    expect(spy).toHaveBeenCalledWith(2);
  });

  it('StateStore with a string', () => {
    // With string
    const stringStore = new StateStore<string | null>(null);
    const spy = jest.fn();
    stringStore.value$.subscribe(spy);
    expect(spy).toHaveBeenLastCalledWith(null);

    stringStore.update('Hello');
    expect(spy).toHaveBeenLastCalledWith('Hello');
  });

  it('StateStore with an object', () => {
    // With object
    const initialObject = { name: 'Joe', age: 33 };
    const objectStore = new StateStore(initialObject);
    const spy = jest.fn();
    objectStore.value$.subscribe(spy);
    expect(spy).toHaveBeenLastCalledWith(initialObject);

    objectStore.patch({ age: 34 });
    expect(spy.mock.lastCall[0].age).toEqual(34);
  });

  it('StateStore with an array', () => {
    const initialArray = [
      { id: 1, name: 'Joe' },
      { id: 2, name: 'Maria' },
    ];
    // Array store
    const arrayStore = new StateStore(initialArray);
    const spy = jest.fn();
    arrayStore.value$.subscribe(spy);
    expect(spy).toHaveBeenLastCalledWith(initialArray);

    arrayStore.addItem({ id: 3, name: 'Eduard' });
    expect(spy.mock.lastCall[0].length).toEqual(3);

    arrayStore.updateItem({ id: 3, name: 'Margaret' });
    expect(spy.mock.lastCall[0][2].name).toEqual('Margaret');

    arrayStore.removeItem({ id: 3, name: 'Margaret' });
    expect(spy.mock.lastCall[0].length).toEqual(2);

    arrayStore.removeItemById(1);
    expect(spy.mock.lastCall[0].length).toEqual(1);

    arrayStore.destroy();
    expect(spy).toHaveBeenCalledTimes(5);
    arrayStore.addItem({ id: 3, name: 'Eduard' });
    expect(spy).toHaveBeenCalledTimes(5);
  });
});
