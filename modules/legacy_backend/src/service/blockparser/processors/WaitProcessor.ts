import { Protocol } from '@entity/Protocol';
import { provide } from 'inversify-binding-decorators';
import BlockProcessor from './BlockProcessor';

@provide(WaitProcessor)
export default class WaitProcessor extends BlockProcessor {
    public async process(
        block: Element,
        protocol: Protocol,
    ): Promise<Protocol> {
        const time = parseInt(
            block.querySelector(':scope>field[name=wait_time]')!.innerHTML,
        );
        this.helper.appendWaitStep(protocol, time);
        return protocol;
    }
}
