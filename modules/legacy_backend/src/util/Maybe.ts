
export class Maybe<T> {
    private constructor(private value: T | null) { }

    static some<T>(value: T) {
        if (!value) {
            throw Error("Provided value must not be empty");
        }
        return new Maybe(value);
    }

    static none<T>() {
        return new Maybe<T>(null);
    }

    static fromValue<T>(value: T | null | undefined): Maybe<T> {
        if (value === null || value === undefined) {
            return Maybe.none<T>();
        }
        return Maybe.some(value!)
    }

    getOrElse(defaultValue: T) {
        return this.value === null ? defaultValue : this.value;
    }

    getOrThrow(errorSupplier: () => Error) {
        if (this.value === null) {
            throw errorSupplier();
        }
        return this.value;
    }

    map<R>(f: (wrapped: T) => R): Maybe<R> {
        if (this.value === null) {
            return Maybe.none<R>();
        } else {
            return Maybe.fromValue(f(this.value));
        }
    }

    flatMap<R>(f: (wrapped: T) => Maybe<R>): Maybe<R> {
        if (this.value === null) {
            return Maybe.none<R>();
        } else {
            return f(this.value);
        }
    }

    isPresent(): boolean {
        return this.value !== null;
    }

}