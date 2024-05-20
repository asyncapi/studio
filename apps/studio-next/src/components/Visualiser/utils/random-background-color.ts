export default (stringInput: string) => {
  //@ts-ignore
  const stringUniqueHash = [...stringInput].reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  return `hsla(${stringUniqueHash % 360}, 95%, 35%, 0.5)`;
};