function isObject(object: Record<string, any>) {
  return object && typeof object === 'object';
}

export function isDeepEqual(object1: Record<string, any>, object2: Record<string, any>) {
  const objKeys1 = Object.keys(object1);
  const objKeys2 = Object.keys(object2);

  if (objKeys1.length !== objKeys2.length) {
    return false;
  }

  for (const key of objKeys1) {
    const value1 = object1[String(key)];
    const value2 = object2[String(key)];

    const isObjects = isObject(value1) && isObject(value2);

    if ((isObjects && !isDeepEqual(value1, value2)) ||
      (!isObjects && value1 !== value2)
    ) {
      return false;
    }
  }
  return true;
}
