import axios from 'axios'

const domain = window.location.origin
const prefix = "/api"

type ToNumberFunction<T> = (o: T) => number
type ObjectComparator<T> = (o1: T, o2: T) => number

export async function getRequest(path: string) {
    const fullpath = domain + prefix + path
    console.log("GET: " + fullpath)
    return axios.get(fullpath)
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