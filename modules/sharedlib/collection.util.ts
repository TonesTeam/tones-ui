
export function groupByMapped<T, K, V>(list: T[], keyGetter: (o: T) => K, mapper: ((o: T) => V)): Map<K, V[]> {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [mapper(item)]);
        } else {
            collection.push(mapper(item));
        }
    });
    return map;
}

export function groupBy<T, K>(list: T[], keyGetter: (o: T) => K): Map<K, T[]> {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}