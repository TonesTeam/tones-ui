import { inject } from "inversify";
import { provide } from "inversify-binding-decorators";
import { DelimiterParser, SerialPort } from "serialport";
import { Logger } from "tslog";
import { Message, MessageChannel } from "./Message";

@provide(ControllerMessageInterface)
export class ControllerMessageInterface {

    @inject(Logger)
    private logger: Logger;
    @inject(SerialPort)
    private serialPort: SerialPort;
    @inject(DelimiterParser)
    private parser: DelimiterParser;

    public async readMsgFromChannel(channel: MessageChannel): Promise<Message> {
        while (true) {
            const msg = await this.readMsg();
            if (msg.channel === channel) {
                return msg;
            }
        }
    }

    public sendMsg(msg: Message) {
        this.logger.trace(`Sending message: ${msg.toString()}`)
        this.serialPort.write(msg.toString());
    }

    private readMsg(): Promise<Message> {
        return new Promise((resolve, reject) => {
            this.parser.on('data', (buf: Buffer) => {
                const data = buf.toString();
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
                resolve(msg);
            })
        });
    }

}