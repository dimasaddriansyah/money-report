export interface LookupItem {
  id: string;
  name: string;
}

export function createLookup<T extends LookupItem>(
  items: T[]
): Record<string, string> {
  return Object.fromEntries(
    items.map(({ id, name }) => [id, name])
  );
}