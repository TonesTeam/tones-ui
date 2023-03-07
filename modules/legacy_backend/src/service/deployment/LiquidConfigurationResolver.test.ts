import { LiquidApplicationCommand } from "@service/commands/Commands";
import { expect } from 'chai';
import { groupByMapped } from "sharedlib/collection.util";
import { LiquidConfigurationResolver } from "./LiquidConfigurationResolver";


describe('Resolve liquid configuration', () => {
    it('Single liquid: [50 10]', () => {
        const r = new LiquidConfigurationResolver()
        const conf = r.resolveLiquidConfiguration([
            new LiquidApplicationCommand(undefined, 1, 50, { id: 1, isWashing: false, isWater: false }),
            new LiquidApplicationCommand(undefined, 1, 10, { id: 1, isWashing: false, isWater: false }),
        ])
        const res = conf.map(d => d.liquidAmount)
        console.log(res);
        expect(res).to.have.ordered.members([50, 15])
    })

    it('2 liquids: [1 2 2], [14 2]', () => {
        const r = new LiquidConfigurationResolver()
        const conf = r.resolveLiquidConfiguration([
            new LiquidApplicationCommand(undefined, 1, 1, { id: 1, isWashing: false, isWater: false }),
            new LiquidApplicationCommand(undefined, 1, 2, { id: 1, isWashing: false, isWater: false }),
            new LiquidApplicationCommand(undefined, 1, 2, { id: 1, isWashing: false, isWater: false }),
            new LiquidApplicationCommand(undefined, 1, 14, { id: 2, isWashing: false, isWater: false }),
            new LiquidApplicationCommand(undefined, 1, 2, { id: 2, isWashing: false, isWater: false }),
        ])
        const liquidsConf = groupByMapped(conf, d => d.liquidId, d => d.liquidAmount)
        expect(liquidsConf.get(1)).to.have.ordered.members([5])
        expect(liquidsConf.get(2)).to.have.ordered.members([50])
    })

    it('1 liquid: [25 30 5]', () => {
        const r = new LiquidConfigurationResolver()
        const conf = r.resolveLiquidConfiguration([
            new LiquidApplicationCommand(undefined, 1, 25, { id: 1, isWashing: false, isWater: false }),
            new LiquidApplicationCommand(undefined, 1, 30, { id: 1, isWashing: false, isWater: false }),
            new LiquidApplicationCommand(undefined, 1, 5, { id: 1, isWashing: false, isWater: false }),
        ])
        const liquidsConf = groupByMapped(conf, d => d.liquidId, d => d.liquidAmount)
        expect(liquidsConf.get(1)).to.have.ordered.members([50, 50])
    })
})