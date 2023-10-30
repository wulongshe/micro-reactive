import { Signal } from './type';
import { isObject, DELETE, READ, state } from './utils';

export function createSignal<T>(value: T, path: string): Signal<T> {
  if (!path) throw new Error('path can not be empty');
  const segments = path.split('.');
  function signal<T>(): T;
  function signal<T>(value: T): T;
  function signal<T extends object>(value: Partial<T>, patch: boolean): T;
  function signal(value = READ, patch = false): T | boolean {
    const keys = [...segments];
    const key = keys.pop() as string;
    const data = keys.reduce((obj, k) => obj[k], state);

    // read
    if (value === READ) return data[key];
    // delete
    if (value === DELETE) return delete data[key];
    // write
    return patch && isObject(value) && isObject(data[key]) ? Object.assign(data[key], value) : (data[key] = value);
  }
  signal(value);
  return signal as Signal<T>;
}
