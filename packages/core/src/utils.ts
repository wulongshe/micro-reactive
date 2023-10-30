export const READ = Symbol('READ') as any;
export const DELETE = Symbol('DELETE') as any;
export const state: any = {};

export function isObject(val: any) {
  return typeof val === 'object' && val !== null;
}

export function ownKeys(val: any) {
  return isObject(val) ? Reflect.ownKeys(val) : [];
}

let id = 0;

export function getId() {
  return String(id++);
}
