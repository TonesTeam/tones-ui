import { Protocol } from '@entity/Protocol';
import { provide } from 'inversify-binding-decorators';
import BlockProcessor from './BlockProcessor';

@provide(SetTemperatureProcessor)
export default class SetTemperatureProcessor extends BlockProcessor {
    public async process(
        block: Element,
        protocol: Protocol,
    ): Promise<Protocol> {
        const targetTemp = parseInt(
            block.querySelector(':scope>field[name=degrees]')!.innerHTML,
        );
        const blocking =
            'true' ===
            block
                .querySelector(':scope>field[name=blocking]')!
                .innerHTML.toLowerCase();
        this.helper.appendTempStep(protocol, targetTemp, blocking);
        return protocol;
    }
}
