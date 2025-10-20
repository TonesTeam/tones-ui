type ExternalLiquid = {
    id: number;
};

type InternalLiquid = {
    x: number;
    y: number;
};

type LiquidType = { Internal: InternalLiquid } | { External: ExternalLiquid };

type WashType = { Custom: string } | { Sys: string };

interface ReagentStep {
    type: 'Reagent';
    id: number;
    params: {
        liquid: {
            type: LiquidType;
            used_cold: boolean;
            toxic: boolean;
        };
        iterations: number;
        washingIterations: number;
        incubation: number;
        targetTemperature: number;
    };
}

interface WashingStep {
    type: 'Washing';
    id: number;
    params: {
        wash: {
            type: WashType;
            used_cold: boolean;
            toxic: boolean;
        };
        iterations: number;
        incubation: number;
    };
}

type ProtocolStep = ReagentStep | WashingStep;

class ProtocolManager {
    private protocol: {
        id: number;
        steps: ProtocolStep[];
    };

    constructor() {
        this.protocol = {
            id: 0,
            steps: [],
        };
    }

    addReagent(
        liquidType: LiquidType,
        usedCold: boolean,
        toxic: boolean,
        incubation: number,
        iterations: number,
        washingIterations: number,
        targetTemperature: number,
        id = 0,
    ): void {
        const step: ReagentStep = {
            type: 'Reagent',
            id,
            params: {
                liquid: {
                    type: liquidType,
                    used_cold: usedCold,
                    toxic,
                },
                incubation,
                iterations,
                washingIterations,
                targetTemperature,
            },
        };
        this.protocol.steps.push(step);
    }

    addWashing(
        washType: WashType,
        usedCold: boolean,
        toxic: boolean,
        iterations: number,
        incubation: number,
        id = 1,
    ): void {
        const step: WashingStep = {
            type: 'Washing',
            id,
            params: {
                wash: {
                    type: washType,
                    used_cold: usedCold,
                    toxic,
                },
                iterations,
                incubation,
            },
        };
        this.protocol.steps.push(step);
    }
}
