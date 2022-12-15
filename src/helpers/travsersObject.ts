export function traverseObject(obj: any, callback: (key: string, value: any) => void, known: Set<any> = new Set()) {
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if (known.has(value)) {
      return;
    }
    known.add(value);
    callback(key, value);
    if (typeof value === 'object' && value !== null) {
      traverseObject(value, callback);
    }
    known.delete(value);
  });
};
