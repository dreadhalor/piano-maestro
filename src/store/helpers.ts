export const toggleSetItem = <T>(currentSet: Set<T>, item: T): Set<T> => {
  const newSet = new Set(currentSet);
  if (newSet.has(item)) {
    newSet.delete(item);
  } else {
    newSet.add(item);
  }
  return newSet;
};
