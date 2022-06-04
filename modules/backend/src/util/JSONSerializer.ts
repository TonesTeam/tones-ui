const getCircularReplacer = () => {
    const seen = new WeakSet()
    return (key: any, value: any) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return
            }
            seen.add(value)
        }
        return value
    }
}

export function safeJSONSerialize(obj: any) {
    return JSON.stringify(obj, getCircularReplacer())
}
