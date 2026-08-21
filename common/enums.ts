export enum UserRole {
    ADMIN = 'Administrator',
    NORMAL = 'Normal User',
}

export enum StepType {
    WASHING = 'Washing',
    LIQUID_APPL = 'Liquid Application',
}

export const WASHING_CATEGORY = 'Washing liquid';

export const isWashingLiquidCategory = (name?: string | null): boolean =>
    typeof name === 'string' &&
    name.trim().toLowerCase() === WASHING_CATEGORY.toLowerCase();
