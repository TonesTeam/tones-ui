import * as fs from 'fs';

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
        incubation: number;
        temperature: number;
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
        iters: number;
        incubation: number;
        temperature: number;
    };
}

interface TemperatureChangeStep {
    id: number;
    type: 'TemperatureChange';
    params: {
        target: number;
    };
}

type ProtocolStep = ReagentStep | WashingStep | TemperatureChangeStep;

class RustProtocolManager {
    private id: number;
    private steps: ProtocolStep[];

    constructor() {
        this.id = 0;
        this.steps = [];
    }

    // addReagent(
    //     liquidType: LiquidType,
    //     usedCold: boolean,
    //     toxic: boolean,
    //     incubation: number,
    //     temperature: number,
    //     id: number = 0
    // ): void {
    //     const step: ReagentStep = {
    //         type: "Reagent",
    //         id,
    //         params: {
    //             liquid: {
    //                 type: liquidType,
    //                 used_cold: usedCold,
    //                 toxic,
    //             },
    //             incubation,
    //             temperature,
    //         },
    //     };
    //     this.protocol.steps.push(step);
    // }

    // addWashing(
    //     washType: WashType,
    //     usedCold: boolean,
    //     toxic: boolean,
    //     iters: number,
    //     incubation: number,
    //     temperature: number,
    //     id: number = 1
    // ): void {
    //     const step: WashingStep = {
    //         type: "Washing",
    //         id,
    //         params: {
    //             wash: {
    //                 type: washType,
    //                 used_cold: usedCold,
    //                 toxic,
    //             },
    //             iters,
    //             incubation,
    //             temperature,
    //         },
    //     };
    //     this.protocol.steps.push(step);
    // }

    // addTemperatureChange(target: number, id: number = 10): void {
    //     const step: TemperatureChangeStep = {
    //         id,
    //         type: "TemperatureChange",
    //         params: {
    //             target,
    //         },
    //     };
    //     this.protocol.steps.push(step);
    // }

    // build(filename: string = "protocol.json"): void {
    //     const jsonData = JSON.stringify(this.protocol, null, 4);
    //     try {
    //         fs.writeFileSync(filename, jsonData);
    //         console.log(`Protocol saved to ${filename}:`);
    //         console.log(jsonData);
    //     } catch (err) {
    //         console.error(`Error writing to file ${filename}:`, (err as Error).message);
    //     }
    // }

    // {"id":2,"steps":[{"type":"Reagent","params":{"liquid":{"slot":0,"Internal":{"x":-1,"y":-1}},"incubation":101,"temperature":50}},{"type":"Reagent","params":{"liquid":{"slot":1,"Internal":{"x":-1,"y":-1}},"incubation":210,"temperature":60}}],"default_wash":{"iters":2,"incubation":5}
    convert(prot: any): void {
        this.id = prot.id;
        this.steps = prot.steps
            .map((s: any) => {
                switch (s.type) {
                    case 'TemperatureChange':
                        return {
                            step_type: {
                                TemperatureChange: {
                                    target: s.params.temperature,
                                },
                            },
                            id: 666,
                        };

                    case 'Reagent':
                        const liquid_params = {
                            reagent_type:
                                s.params.liquid.slot !== undefined
                                    ? { External: s.params.liquid.slot }
                                    : {
                                          Internal: {
                                              x:
                                                  s.params.liquid.Internal?.x ??
                                                  0,
                                              y:
                                                  s.params.liquid.Internal?.y ??
                                                  0,
                                          },
                                      },
                            used_cold: true,
                            toxic: false,
                        };

                        return {
                            step_type: {
                                Reagent: {
                                    liquid_params,
                                    incubation: s.params.incubation ?? 0,
                                    temperature: 0,
                                },
                            },
                            id: 666,
                        };

                    case 'Washing':
                        const wash_type =
                            s.params.wash?.Sys === 'Wash'
                                ? 'SysDefault'
                                : { Custom: 0 };

                        return {
                            step_type: {
                                Washing: {
                                    liquid_params: {
                                        wash_type,
                                        used_cold:
                                            s.params.wash?.used_cold ?? true,
                                        toxic: s.params.wash?.toxic ?? false,
                                    },
                                    iters: s.params.iters ?? 0,
                                    incubation: s.params.incubation ?? 0,
                                    temperature: 0,
                                },
                            },
                            id: 666,
                        };

                    default:
                        console.error(`Unknown step type ${s.type}, skipping.`);
                        return null;
                }
            })
            .filter((step: any) => step !== null) as ProtocolStep[];
    }
}

export default RustProtocolManager;
