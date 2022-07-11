import { inject } from "inversify";
import { provide } from "inversify-binding-decorators";
import { DelimiterParser, SerialPort } from "serialport";
import { Logger } from "tslog";
import { Message, MessageChannel } from "./Message";

@provide(ControllerMessageInterface)
export class ControllerMessageInterface {

    @inject(Logger)
    private logger: Logger;

    constructor(@inject(SerialPort) serialport: SerialPort) {
        const parser = serialport.pipe(new DelimiterParser({ delimiter: ';\n', includeDelimiter: false }))
        parser.on('data', (data: string) => {
            if (typeof data != "string") {
                console.log(`ACTUAL TYPE ${typeof data} ${data}`)
                throw new Error();
            }
            const msgMonad = Message.parse(data)
            if (!msgMonad.isPresent()) {
                this.logger.error(`Invalid data: ${data}`)
                return
            }
            const msg = msgMonad.getOrThrow(() => new Error());
            if (!msg.isValid()) {
                // request retransmision of request (specify channel probably)
                this.logger.error(`Invalid message received: ${msg}`)
                return
            }
            if (msg.channel == MessageChannel.ERROR) {
                this.logger.error(msg.body)
                return
            }
            
        })
    }


}