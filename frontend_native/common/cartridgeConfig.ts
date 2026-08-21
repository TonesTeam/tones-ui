export const CARTRIDGE_CONFIG = {
    size_S: { x: 4, y: 8, name: 'Small liquids', minVolume: 0.5, maxVolume: 2 },
    size_M: { x: 4, y: 5, name: 'Medium liquids', minVolume: 1, maxVolume: 5 },
    size_L: {
        x: 1,
        y: 1,
        name: 'Large liquids',
        minVolume: 100,
        maxVolume: 250,
    }, // 2 rows × 2 columns
};

export const SLOT_QUANTITY = 5;
export const SLOT_VOLUME_ML = 0.25;
