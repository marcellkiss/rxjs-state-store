import { deepPatch } from 'js-deep-patch';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';

export class StateStore<T> {
  private destroy$ = new Subject<void>();
  private _value$: BehaviorSubject<T>;
  public value$: Observable<T>;
  public get value(): T {
    return this._value$.value;
  }

  constructor(initialValue: T) {
    this._value$ = new BehaviorSubject(initialValue);
    this.value$ = this._value$.asObservable().pipe(takeUntil(this.destroy$));
  }

  public destroy() {
    this.destroy$.next();
  }

  public update(value: T) {
    this._value$.next(value);
  }

  /**
   * Patch an object value
   */
  public patch(partialValue: Partial<T>): T {
    if (!this.isObject(this.value)) {
      throw new Error('[StateStore::patch] value is not an object');
    }

    const patchedValue = deepPatch(this.value, partialValue) as T;
    this.update(patchedValue);

    return patchedValue;
  }

  /**
   * Remove an item from an array by id
   */
  public removeItemById(id: unknown) {
    this.removeItem({ id });
  }

  /**
   * Remove an item from an array
   */
  public removeItem(item: Record<any, unknown>): void {
    if (!Array.isArray(this.value)) {
      throw new Error('[StateStore::removeItem] value is not an array');
    }

    // TODO: this may remove multiple items, could be improved
    const updatedArray = (this.value as any[]).filter((el) => {
      if (el.id && item['id']) {
        // Remove based on id, if possible
        return el.id !== item['id'];
      } else {
        // Otherwise just compare
        return el !== item;
      }
    }) as unknown as T;

    this.update(updatedArray);
  }

  /**
   * Update an item in an array
   */
  public updateItem(item: Record<any, unknown>) {
    if (!Array.isArray(this.value)) {
      throw new Error(`[StateStore::updateItem] value is not an array`);
    }
    if (!item['id']) {
      throw new Error(`[StateStore::updateItem] item doesn't have an id`);
    }

    const updatedValues = this.value.map((v) => {
      if (v.id === item['id']) {
        return item;
      } else {
        return v;
      }
    });

    this.update(updatedValues as unknown as T);
  }

  /**
   * Add an item to an array
   */
  public addItem(item: Record<any, unknown>): void {
    if (!Array.isArray(this.value)) {
      throw new Error('[StateStore::addItem] value is not an array');
    }

    // Check, whether we already have the same item
    if (item['id']) {
      const sameItem = (this.value as any[]).find((el) => el.id === item['id']);

      if (sameItem) {
        return; // It's already added
      }
    }

    // Add the new item
    this.update([...this.value, item] as unknown as T);
  }

  private isObject(value: unknown): boolean {
    return typeof value === 'object' && !Array.isArray(value) && value !== null;
  }
}
