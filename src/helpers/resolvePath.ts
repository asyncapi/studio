function resolve(pathA: string & any, pathB: string & any) {
  pathB = pathB.split('/');
  if (pathB[0] === '') {
    return pathB.join('/');
  }
  pathA = pathA.split('/');
  const aLastIndex = pathA.length - 1;
  if (pathA[aLastIndex] !== '') {
      pathA[aLastIndex] = '';
  }

  let part: string;
  let i = 0;
  while (typeof (part = pathB[i]) === 'string') {
    switch (part) {
      case '..':
        pathA.pop();
        pathA.pop();
        pathA.push('');
        break;
      case '.':
        break;
      default:
        pathA.pop();
        pathA.push(part);
        pathA.push('');
        break;
    }
    i++;
  }
  return pathA.join('/');
}

let multiSlashReg = /\/\/+/g;
export function resolvePath(base: string, ...rest: string[]) {
  let i = 0;
  let path;
  let resolved = base;
  while (typeof (path = rest[i]) === 'string') {
    // '//' ==> '/'
    path = path.replace(multiSlashReg, '/');
    resolved = resolve(resolved, path);
    i++;
  }
  return resolved;
}
