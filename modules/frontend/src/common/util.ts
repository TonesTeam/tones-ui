import axios, { Axios, AxiosResponse } from 'axios'

const domain = window.location.origin
const prefix = "/api"

type ToNumberFunction<T> = (o: T) => number
type ObjectComparator<T> = (o1: T, o2: T) => number

export async function getRequest<T>(path: string): Promise<AxiosResponse<T, any>> {
    const fullpath = domain + prefix + path
    console.log("GET: " + fullpath)
    return await axios.get(fullpath)
}

export function ident(o: any): any { return o };

export function groupBy<T, K, V>(list: T[], keyGetter: (o: T) => K, mapper: (o: T) => V = ident): Map<K, V[]> {
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

export function getComparator<T>(fieldExtractor: ToNumberFunction<T>): ObjectComparator<T> {
    return (o1: any, o2: any) => {
        if (fieldExtractor(o1).valueOf() === fieldExtractor(o2)) {
            return 0;
        }
        if (fieldExtractor(o1).valueOf() > fieldExtractor(o2)) {
            return 1;
        }
        return -1;
    }
}