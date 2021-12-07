const maxInt = 2147483647;
let nextReqId = 0;
export function generateUniqueID() {
  nextReqId = (nextReqId + 1) & maxInt;
  return `ID-${nextReqId.toString(36)}`;
}