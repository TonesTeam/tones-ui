type ToNumberFunction<T> = (o: T) => number;
type ObjectComparator<T> = (o1: T, o2: T) => number;

export function groupByMapped<T, K, V>(
    list: T[],
    keyGetter: (o: T) => K,
    mapper: (o: T) => V,
): Map<K, V[]> {
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

export function toMap<T, K>(list: T[], keyGetter: (o: T) => K): Map<K, T> {
    return toKVMap(list, keyGetter, (i) => i);
}

export function toKVMap<T, K, V>(
    list: T[],
    keyGetter: (o: T) => K,
    valueGetter: (o: T) => V,
): Map<K, V> {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const existingItem = map.get(key);
        if (!existingItem) {
            map.set(key, valueGetter(item));
        }
    });
    return map;
}

export function getComparator<T>(
    fieldExtractor: ToNumberFunction<T>,
): ObjectComparator<T> {
    return (o1: any, o2: any) => {
        if (fieldExtractor(o1).valueOf() === fieldExtractor(o2)) {
            return 0;
        }
        if (fieldExtractor(o1).valueOf() > fieldExtractor(o2)) {
            return 1;
        }
        return -1;
    };
}

export function countMapBy<T, K>(
    arr: T[],
    keyGetter: (o: T) => K,
): Map<K, number> {
    const m = new Map<K, number>();
    for (const v of arr) {
        const k = keyGetter(v);
        if (m.has(k)) {
            m.set(k, m.get(k)! + 1);
        } else {
            m.set(k, 1);
        }
    }
    return m;
}

export function countMap<T>(arr: T[]): Map<T, number> {
    const m = new Map<T, number>();
    for (const v of arr) {
        if (m.has(v)) {
            m.set(v, m.get(v)! + 1);
        } else {
            m.set(v, 1);
        }
    }
    return m;
}

export function MaxFold<T>(): (a1: T, a2: T) => T {
    return MaxFolder((a) => a);
}

export function MaxFolder<T, K>(keyGetter: (o: T) => K): (a1: T, a2: T) => T {
    return (a1: T, a2: T) => (keyGetter(a1) > keyGetter(a2) ? a1 : a2);
}

export function SumFold(): (a1: number, a2: number) => number {
    return (a, b) => a + b;
}

export function AnyTrue(): (a1: boolean, a2: boolean) => boolean {
    return (a, b) => a || b;
}
